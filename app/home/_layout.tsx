import LayoutHeader from '@/components/LayoutHeader';
import CustomTabBar from '@/components/TabBar';
import { Tabs } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native';

import '../../global.css';

export default function TabLayout() {
  return (
    <SafeAreaView className="flex-1">
      <LayoutHeader />
      <Tabs screenOptions={{headerShown: false}} tabBar={(props) => <CustomTabBar {...props} />} />
    </SafeAreaView>
  );
}