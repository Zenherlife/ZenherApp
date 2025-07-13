import DatePicker from '@/components/DatePicker';
import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import { Activity, ArrowLeft, Droplet, Heart, Moon, Zap } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SelectedDate, WellnessCategory, WellnessOption, WellnessOptions } from '../utils/types';

interface WellnessScreenProps {
  selectedDate: SelectedDate | null;
  wellnessData: Record<string, any>;
  wellnessOptions: WellnessOptions;
  onUpdateWellnessData: (category: WellnessCategory, option: WellnessOption) => Promise<void>;
  loading: boolean;
  onGoBack: () => void;
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

const WellnessSection: React.FC<WellnessSectionProps> = ({
  title,
  category,
  options,
  selectedDate,
  wellnessData,
  onUpdateWellnessData,
  isDark,
}) => {

  const getCurrentData = (category: WellnessCategory): WellnessOption | null => {
    if (!selectedDate) return null;
    return wellnessData[selectedDate.key]?.[category] || null;
  };

  const handleUpdate = async (category: WellnessCategory, option: WellnessOption) => {
    await onUpdateWellnessData(category, option);
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
              onPress={() => handleUpdate(category, option)}
              className="mr-2 mb-2 rounded-2xl overflow-hidden"
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
                  className="px-5 py-3 rounded-2xl"
                  style={{
                    borderWidth: 2,
                    borderColor: option.textColor + "20",
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

const WellnessScreen: React.FC<WellnessScreenProps> = ({
  selectedDate,
  wellnessData,
  wellnessOptions,
  onUpdateWellnessData,
  loading,
  onGoBack,
}) => {
  const colorScheme = useColorScheme();
  const { lastPeriodDate, updateUserData} = useUserDataStore((state) => (state))
  const isDark = colorScheme === 'dark';
  const dateTitle = useMemo(() => {
    if (!selectedDate) return "Wellness Entry";
    
    const isToday = selectedDate.day === new Date().getDate() &&
                   selectedDate.month === new Date().getMonth() &&
                   selectedDate.year === new Date().getFullYear();
                   
    return isToday ? "How are you feeling today?" : "How were you feeling?";
  }, [selectedDate]);

  const dateSubtitle = useMemo(() => {
    if (!selectedDate) return "";
    return `${months[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`;
  }, [selectedDate]);

  const handlePeriodDateUpdate = async (date: Date) => {
    updateUserData({lastPeriodDate: formatDateString(date)})
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="relative overflow-hidden">
        <View
          className={`absolute inset-0 ${
            isDark ? "bg-blue-900/10" : "bg-blue-50/50"
          }`}
        />
        <View
          className={`flex-row items-center justify-between px-6 py-4 border-b ${
            isDark ? "border-gray-800" : "border-gray-100"
          }`}
        >
          <TouchableOpacity
            onPress={onGoBack}
            className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${
              isDark ? "bg-gray-700" : "bg-gray-50"
            }`}
            style={{
              shadowColor: "#666",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8,
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={isDark ? "#f3f4f6" : "#374151"} />
          </TouchableOpacity>
          
          <View className="flex-1">
            <Text
              className={`text-2xl font-bold tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {dateTitle}
            </Text>
            <Text
              className={`text-base font-medium mt-1 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {dateSubtitle}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <DatePicker
          value={lastPeriodDate}
          onDateChange={handlePeriodDateUpdate}
          minDate={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
          maxDate={new Date(Date.now())}
        />
        <View className="px-6 pb-6 pt-3">
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
        </View>
      </ScrollView>
    </View>
  );
};

export default WellnessScreen;