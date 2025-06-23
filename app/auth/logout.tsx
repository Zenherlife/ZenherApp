import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import { Feather, Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import { TextInput } from 'react-native-gesture-handler';

export default function AccountScreen() {
  const navigation = useNavigation();
  const user = useUserDataStore.getState().getUser();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedDate, setSelectedDate] = useState(user?.dateOfBirth || null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const setField = useUserDataStore((state) => state.setField);
  const {uid,displayName, dateOfBirth, email} = useUserDataStore((state) => state);
  const [name, setName] = useState(displayName || "");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const months = [
    "January","February","March","April","May","June","July","August","September","October","November", "December",
  ];

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  const years = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => 1900 + i
  ).reverse();
  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);

    return days;
  };
  const calendarDays = generateCalendarDays();
  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    const dayString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    return dayString === selectedDate;
  };

  const handleDayPress = (day) => {
    if (day) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      setSelectedDate(dateString);
      setField("dateOfBirth", dateString);
      setShowCalendar(false);
    }
  };
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  const handleYearSelect = (year) => {
    setCurrentYear(year);
    setShowYearPicker(false);
  };

  useEffect(() => {
    StatusBar.setBarStyle(isDark ? "light-content" : "dark-content");
  }, [isDark]);

  const signOut = async () => {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      const isGoogleSignedIn = userInfo != null;

      if (isGoogleSignedIn) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }

      await auth().signOut();
      ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "index" }],
        })
      );
    } catch (error) {
      console.error("SignOut error:", error);
    }
  };

  const handleSave = async () => {

    try {
      await firestore()
      .collection("users")
      .doc(uid)
      .update({
        displayName: name,
        dateOfBirth: selectedDate,
      });

      ToastAndroid.show("Profile updated successfully", ToastAndroid.SHORT);
      router.back();

    }catch(e) {
      console.log("Failed to update profile:",e);
    }
  }
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 px-6 ">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          className="flex-row items-center  mt-4"
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Text className="text-black dark:text-white text-xl font-semibold ml-4">
            Edit Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowLogoutConfirm(true)}
          className="flex-row items-center gap-1 mt-4"
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Text className="text-black dark:text-white text-xl font-medium">
            Sign out
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <View className="items-center mt-10">
        <View className="relative">
          <Image
            source={{ uri: user.photoURL }}
            className="w-24 h-24 rounded-full border-2 border-gray-400 dark:border-gray-200"
          />
          {/* Camera Icon  */}
          {/* <TouchableOpacity className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full">
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Personal Info */}
      <Text className="text-black dark:text-white font-semibold mt-10 mb-2">
        Fullname
      </Text>

      <TextInput
        placeholder="Enter name (e.g., Zenher)"
        defaultValue={name}
        onChangeText={setName}
        className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-lg px-4 py-3 mb-4 "
      />
      <Text className="text-black dark:text-white font-semibold mb-1">
        Date of Birth
      </Text>
      <View className="flex-row gap-2 mb-4">
        <View className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 flex-row items-center justify-between">
          <Text className="text-black dark:text-white text-base">
            {selectedDate
              ? new Date(selectedDate).toLocaleDateString("en-GB")
              : "Select date of birth"}
          </Text>
          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <Ionicons
              name="calendar"
              size={20}
              color={colorScheme === "dark" ? "#b7d4ff" : "#0000FF"}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Email */}
      <Text className="text-black dark:text-white font-semibold mb-                                              1">
        Email Address
      </Text>
      <Text className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 mb-4 text-black dark:text-white">
        {email}
      </Text>

      <TouchableOpacity
        className="rounded-full py-3 mb-3"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-center text-black dark:text-white font-semibold text-lg">
          Cancel
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSave}
        className="bg-indigo-800 dark:bg-white rounded-full py-4 mt-4 mb-3"
      >
        <Text className="text-center text-white dark:text-black font-semibold text-lg">
          Save
        </Text>
      </TouchableOpacity>
      <Modal visible={showCalendar} transparent={true} animationType="fade">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white dark:bg-gray-900 rounded-t-2xl p-4 max-h-[80%]">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity
                onPress={handlePrevMonth}
                disabled={showYearPicker}
              >
                <Feather
                  name="chevron-left"
                  size={24}
                  color={isDark ? "white" : "black"}
                  style={{ opacity: showYearPicker ? 0.3 : 1 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowYearPicker(!showYearPicker)}
                className="flex-row items-center space-x-1"
              >
                <Text className="text-lg font-medium text-black dark:text-white">
                  {months[currentMonth]} {currentYear}
                </Text>
                <Feather
                  name={showYearPicker ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextMonth}
                disabled={showYearPicker}
              >
                <Feather
                  name="chevron-right"
                  size={24}
                  color={isDark ? "white" : "black"}
                  style={{ opacity: showYearPicker ? 0.3 : 1 }}
                />
              </TouchableOpacity>
            </View>

            {showYearPicker ? (
              // Year Picker Grid
              <View className="mt-2 max-h-[250px] border-t border-gray-300 dark:border-gray-700">
                <Text className="text-center text-gray-600 dark:text-gray-300 text-base mb-2 mt-2">
                  Select a Year
                </Text>
                <View className="h-[200px]">
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {years.map((year) => (
                      <TouchableOpacity
                        key={year}
                        onPress={() => handleYearSelect(year)}
                        className="py-2"
                      >
                        <Text
                          className={`text-center text-lg ${
                            year === currentYear
                              ? "text-indigo-700 dark:text-indigo-300 font-semibold"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            ) : (
              // Calendar View
              <>
                {/* Weekday Header */}
                <View className="flex-row justify-between mb-2">
                  {weekDays.map((d, i) => (
                    <Text
                      key={i}
                      className="text-center text-sm text-gray-500 w-[14.28%]"
                    >
                      {d}
                    </Text>
                  ))}
                </View>

                {/* Calendar Grid */}
                {Array.from(
                  { length: Math.ceil(calendarDays.length / 7) },
                  (_, weekIndex) => (
                    <View key={weekIndex} className="flex-row mb-2">
                      {calendarDays
                        .slice(weekIndex * 7, weekIndex * 7 + 7)
                        .map((day, i) => (
                          <View key={i} className="w-[14.28%] items-center">
                            {day ? (
                              <TouchableOpacity
                                onPress={() => handleDayPress(day)}
                                className={`w-10 h-10 justify-center items-center rounded-full ${
                                  isSelected(day)
                                    ? "bg-black dark:bg-white"
                                    : ""
                                }`}
                              >
                                <Text
                                  className={`text-base ${
                                    isSelected(day)
                                      ? "text-white dark:text-black font-semibold"
                                      : "text-black dark:text-white"
                                  }`}
                                >
                                  {day}
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <View className="w-10 h-10" />
                            )}
                          </View>
                        ))}
                    </View>
                  )
                )}
              </>
            )}

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={() => {
                setShowCalendar(false);
                setShowYearPicker(false);
              }}
              className="mt-4 bg-gray-100 dark:bg-gray-700 py-3 rounded-xl"
            >
              <Text className="text-center text-base text-black dark:text-white">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={showLogoutConfirm} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <Text className="text-black dark:text-white text-lg font-semibold mb-4 text-center">
              Are you sure you want to sign out?
            </Text>

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="flex-1 bg-gray-300 dark:bg-gray-700 rounded-lg py-3 mr-2"
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text className="text-center text-black dark:text-white font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-indigo-800 dark:bg-white rounded-lg py-3 ml-2"
                onPress={async () => {
                  setShowLogoutConfirm(false);
                  await signOut();
                }}
              >
                <Text className="text-center text-white dark:text-black font-medium">
                  Yes, Sign out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
