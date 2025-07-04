import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import firestore from '@react-native-firebase/firestore';
import { Activity, Droplet, Heart, Moon, X, Zap } from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SelectedDate, WellnessCategory, WellnessOption, WellnessOptions } from '../utils/types';

const { height: screenHeight } = Dimensions.get('window');

interface WellnessModalProps {
  visible: boolean;
  selectedDate: SelectedDate | null;
  wellnessData: Record<string, any>;
  wellnessOptions: WellnessOptions;
  onClose: () => void;
  onUpdateWellnessData: (category: WellnessCategory, option: WellnessOption) => Promise<void>;
  loading: boolean;
}

interface WellnessSectionProps {
  title: string;
  category: WellnessCategory;
  options: WellnessOption[];
  selectedDate: SelectedDate | null;
  wellnessData: Record<string, any>;
  onUpdateWellnessData: (category: WellnessCategory, option: WellnessOption) => Promise<void>;
  isDark: boolean;
}

const getCategoryIcon = (category: WellnessCategory, isDark: boolean) => {
  const iconSize = 20;
  const iconColor = isDark ? '#60a5fa' : '#3b82f6';
  
  switch (category) {
    case 'flow':
      return <Droplet size={iconSize} color={iconColor} fill={iconColor} />;
    case 'feelings':
      return <Heart size={iconSize} color={iconColor} fill={iconColor} />;
    case 'sleep':
      return <Moon size={iconSize} color={iconColor} fill={iconColor} />;
    case 'pain':
      return <Activity size={iconSize} color={iconColor} fill={iconColor} />;
    case 'energy':
      return <Zap size={iconSize} color={iconColor} fill={iconColor} />;
    default:
      return null;
  }
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const formatDateString = (date: Date): string => {
  const monthStr = String(date.getMonth() + 1).padStart(2, "0");
  const dayStr = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${monthStr}-${dayStr}`;
};

const createDateFromSelected = (selectedDate: SelectedDate): Date => {
  return new Date(selectedDate.year, selectedDate.month, selectedDate.day);
};

const WellnessSection: React.FC<WellnessSectionProps> = ({
  title,
  category,
  options,
  selectedDate,
  wellnessData,
  onUpdateWellnessData,
  isDark,
}) => {

  const { lastPeriodDate, uid } = useUserDataStore();

  const getCurrentData = (category: WellnessCategory): WellnessOption | null => {
    if (!selectedDate) return null;
    return wellnessData[selectedDate.key]?.[category] || null;
  };

  const handleFlowUpdate = async (category: WellnessCategory, option: WellnessOption) => {
    await onUpdateWellnessData(category, option);

    if (category === 'flow' && selectedDate) {
      const currentSelectedDate = createDateFromSelected(selectedDate);
      const currentSelectedDateString = formatDateString(currentSelectedDate);

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentSelectedDate);
        date.setDate(date.getDate() - i);
        return formatDateString(date);
      });

      if (!last7Days.includes(lastPeriodDate)) {
        await firestore()
          .collection('users')
          .doc(uid)
          .update({
            lastPeriodDate: currentSelectedDateString,
          });
      }
    }
  };

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-4">
        <View className={`w-10 h-10 rounded-2xl items-center justify-center mr-3 ${
          isDark ? 'bg-blue-500/20' : 'bg-blue-50'
        }`}>
          {getCategoryIcon(category, isDark)}
        </View>
        <Text className={`text-lg font-bold tracking-wide ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </Text>
      </View>
      <View className="flex-row flex-wrap">
        {options.map((option, index) => {
          const isSelected = getCurrentData(category)?.label === option.label;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleFlowUpdate(category, option)}
              className="mr-3 mb-3 rounded-2xl overflow-hidden"
              style={{
                shadowColor: isSelected ? option.color : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: isSelected ? 8 : 0,
              }}
              activeOpacity={0.8}
            >
              {isSelected ? (
                <View
                  className="px-5 py-3 border-2 border-transparent rounded-2xl"
                  style={{
                    backgroundColor: option.color,
                  }}
                >
                  <Text 
                    numberOfLines={1}
                    className="text-sm font-semibold tracking-wide"
                    style={{ color: option.textColor }}
                  >
                    {option.label}
                  </Text>
                </View>
              ) : (
                <View
                  className={`px-5 py-3 border-2 rounded-2xl ${
                    isDark 
                      ? 'border-gray-700 bg-gray-800/50' 
                      : 'border-gray-200 bg-gray-50/80'
                  }`}
                >
                  <Text 
                    numberOfLines={1}
                    className={`text-sm font-medium tracking-wide ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const WellnessModal: React.FC<WellnessModalProps> = ({
  visible,
  selectedDate,
  wellnessData,
  wellnessOptions,
  onClose,
  onUpdateWellnessData,
  loading,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop with blur effect */}
        <View className="absolute inset-0 bg-black/30" />

        <View
          className={`${
            isDark ? "bg-gray-900" : "bg-white"
          } rounded-t-3xl shadow-2xl overflow-hidden`}
          style={{
            height: screenHeight * 0.8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 25,
          }}
        >
          {/* Modal Header */}
          <View className="relative overflow-hidden">
            <View
              className={`absolute inset-0 ${
                isDark ? "bg-blue-900/10" : "bg-blue-50/50"
              }`}
            />
            <View
              className={`flex-row items-center justify-between p-6 border-b ${
                isDark ? "border-gray-800" : "border-gray-100"
              }`}
            >
              <View className="flex-1">
                <Text
                  className={`text-2xl font-bold tracking-tight ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedDate &&
                  selectedDate.day === new Date().getDate() &&
                  selectedDate.month === new Date().getMonth() &&
                  selectedDate.year === new Date().getFullYear()
                    ? "How are you feeling today?"
                    : "How were you feeling?"}
                </Text>
                {selectedDate && (
                  <Text
                    className={`text-base font-medium mt-1 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {months[selectedDate.month]} {selectedDate.day},{" "}
                    {selectedDate.year}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={onClose}
                className={`w-12 h-12 rounded-2xl items-center justify-center ${
                  isDark ? "bg-gray-800/80" : "bg-gray-100/80"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                activeOpacity={0.7}
              >
                <X size={22} color={isDark ? "#f3f4f6" : "#374151"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Modal Content */}
          <ScrollView
            className="flex-1 px-6 py-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <WellnessSection
              title="Flow"
              category="flow"
              options={wellnessOptions.flow}
              selectedDate={selectedDate}
              wellnessData={wellnessData}
              onUpdateWellnessData={onUpdateWellnessData}
              isDark={isDark}
            />
            <WellnessSection
              title="Feelings"
              category="feelings"
              options={wellnessOptions.feelings}
              selectedDate={selectedDate}
              wellnessData={wellnessData}
              onUpdateWellnessData={onUpdateWellnessData}
              isDark={isDark}
            />
            <WellnessSection
              title="Sleep"
              category="sleep"
              options={wellnessOptions.sleep}
              selectedDate={selectedDate}
              wellnessData={wellnessData}
              onUpdateWellnessData={onUpdateWellnessData}
              isDark={isDark}
            />
            <WellnessSection
              title="Pain"
              category="pain"
              options={wellnessOptions.pain}
              selectedDate={selectedDate}
              wellnessData={wellnessData}
              onUpdateWellnessData={onUpdateWellnessData}
              isDark={isDark}
            />
            <WellnessSection
              title="Energy"
              category="energy"
              options={wellnessOptions.energy}
              selectedDate={selectedDate}
              wellnessData={wellnessData}
              onUpdateWellnessData={onUpdateWellnessData}
              isDark={isDark}
            />
          </ScrollView>

          {/* Modal Footer */}
          <View
            className={`p-6 border-t ${
              isDark ? "border-gray-800" : "border-gray-100"
            }`}
          >
            <TouchableOpacity
              onPress={onClose}
              className={`py-4 rounded-2xl items-center ${
                loading ? 'bg-gray-400' : 'bg-blue-500'
              }`}
              style={{
                shadowColor: loading ? "#6b7280" : "#3b82f6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
              activeOpacity={loading ? 1 : 0.9}
              disabled={loading}
            >
              <Text className="text-white font-bold text-lg tracking-wide">
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WellnessModal;