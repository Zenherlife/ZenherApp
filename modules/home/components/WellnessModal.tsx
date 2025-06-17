import { X } from 'lucide-react-native';
import React from 'react';
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { SelectedDate, WellnessCategory, WellnessData, WellnessOption, WellnessOptions } from '../utils/types';

interface WellnessModalProps {
  visible: boolean;
  selectedDate: SelectedDate | null;
  wellnessData: WellnessData;
  wellnessOptions: WellnessOptions;
  onClose: () => void;
  onUpdateWellnessData: (category: WellnessCategory, option: WellnessOption) => void;
}

interface WellnessSectionProps {
  title: string;
  category: WellnessCategory;
  options: WellnessOption[];
  selectedDate: SelectedDate | null;
  wellnessData: WellnessData;
  onUpdateWellnessData: (category: WellnessCategory, option: WellnessOption) => void;
  isDark: boolean;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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

  return (
    <View className="mb-6">
      <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </Text>
      <View className="flex-row flex-wrap">
        {options.map((option, index) => {
          const isSelected = getCurrentData(category)?.label === option.label;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onUpdateWellnessData(category, option)}
              className={`mr-2 mb-2 px-4 py-2 rounded-full border-2 ${
                isSelected 
                  ? 'border-blue-500' 
                  : isDark 
                    ? 'border-gray-600' 
                    : 'border-gray-200'
              }`}
              style={{
                backgroundColor: isSelected ? option.color : (isDark ? '#374151' : '#f9fafb')
              }}
              activeOpacity={0.7}
            >
              <Text 
                className={`text-sm font-medium ${
                  isSelected 
                    ? '' 
                    : isDark 
                      ? 'text-gray-300' 
                      : 'text-gray-700'
                }`}
                style={{
                  color: isSelected ? option.textColor : undefined
                }}
              >
                {option.label}
              </Text>
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
      <View className="flex-1 bg-black/50 justify-end">
        <View
          className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl shadow-2xl`}
        >
          {/* Modal Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <View>
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                How are you feeling?
              </Text>
              {selectedDate && (
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {months[selectedDate.month]} {selectedDate.day}, {selectedDate.year}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={onClose}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}
              activeOpacity={0.7}
            >
              <X size={20} color={isDark ? '#f3f4f6' : '#374151'} />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView 
            className="max-h-96 px-6 py-4"
            showsVerticalScrollIndicator={false}
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
          </ScrollView>

          {/* Modal Footer */}
          <View className="p-6 border-t border-gray-200 dark:border-gray-700">
            <TouchableOpacity
              onPress={onClose}
              className="bg-blue-500 py-4 rounded-2xl items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-lg">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WellnessModal;