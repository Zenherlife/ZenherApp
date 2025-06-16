import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

interface MonthData {
  id: string;
  title: string;
  days: Date[];
  year: number;
  month: number;
}

const getMonthTitle = (date: Date) =>
  date.toLocaleString('default', { month: 'long', year: 'numeric' });

const generateMonth = (year: number, month: number): MonthData => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return {
    id: `${year}-${month}`,
    title: getMonthTitle(firstDay),
    days,
    year,
    month,
  };
};

const generateMonths = (startYear: number, startMonth: number, count: number): MonthData[] => {
  const months: MonthData[] = [];
  let currentYear = startYear;
  let currentMonth = startMonth;

  for (let i = 0; i < count; i++) {
    months.push(generateMonth(currentYear, currentMonth));
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  return months;
};

const MonthComponent = React.memo(({ item }: { item: MonthData }) => {
  const grid = useMemo(() => {
    const startPad = item.days[0]?.getDay() ?? 0;
    const totalCells = startPad + item.days.length;
    const rows = Math.ceil(totalCells / 7);
    const monthGrid: (Date | null)[][] = [];

    let dayIndex = 0;
    for (let r = 0; r < rows; r++) {
      const week: (Date | null)[] = [];
      for (let c = 0; c < 7; c++) {
        const cellIndex = r * 7 + c;
        if (cellIndex < startPad) {
          week.push(null);
        } else {
          week.push(item.days[dayIndex++] ?? null);
        }
      }
      monthGrid.push(week);
    }
    return monthGrid;
  }, [item.days]);

  const today = useMemo(() => new Date(), []);
  const isToday = useCallback((date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  }, [today]);

  const isWeekend = useCallback((date: Date | null) => {
    if (!date) return false;
    const day = date.getDay();
    return day === 0 || day === 6;
  }, []);

  return (
    <View className="py-4 px-3 border-b border-gray-200 bg-white">
      <Text className="text-xl font-bold mb-3 text-gray-800">{item.title}</Text>
      
      <View className="flex-row mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text 
            key={`header-${day}-${index}`} 
            className="flex-1 text-center font-semibold text-gray-600 text-sm"
          >
            {day}
          </Text>
        ))}
      </View>

      {grid.map((week, rowIndex) => (
        <View key={`${item.id}-week-${rowIndex}`} className="flex-row mb-1">
          {week.map((date, colIndex) => {
            const cellKey = `${item.id}-${rowIndex}-${colIndex}`;
            const todayStyle = isToday(date) ? 'bg-blue-500' : 'bg-gray-50';
            const weekendStyle = isWeekend(date) ? 'text-red-500' : 'text-gray-800';
            const textColor = isToday(date) ? 'text-white' : weekendStyle;
            
            return (
              <View 
                key={cellKey}
                className={`flex-1 justify-center items-center rounded-lg mx-0.5 ${todayStyle}`}
                style={{ height: width / 9 }}
              >
                {date ? (
                  <Text className={`text-sm font-medium ${textColor}`}>
                    {date.getDate()}
                  </Text>
                ) : (
                  <Text className="text-sm font-medium text-transparent">0</Text>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
});

MonthComponent.displayName = 'MonthComponent';

export default function CalendarScreen() {
  const [months, setMonths] = useState<MonthData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Start with current month - 1 to current + 3 months ahead
    const startYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const startMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    const initialMonths = generateMonths(startYear, startMonth, 5);
    setMonths(initialMonths);
  }, []);

  const loadMoreMonths = useCallback(() => {
    if (isLoading || months.length === 0) return;
    
    setIsLoading(true);
    
    // Use setTimeout to prevent blocking the UI
    setTimeout(() => {
      const lastMonth = months[months.length - 1];
      let nextYear = lastMonth.year;
      let nextMonth = lastMonth.month + 1;
      
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
      }
      
      // Generate new months, avoiding duplicates
      const newMonths: MonthData[] = [];
      const existingKeys = new Set(months.map(m => m.id));
      let currentYear = nextYear;
      let currentMonth = nextMonth;
      
      for (let i = 0; i < 2; i++) {
        const monthId = `${currentYear}-${currentMonth}`;
        if (!existingKeys.has(monthId)) {
          newMonths.push(generateMonth(currentYear, currentMonth));
        }
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
      }
      
      setMonths(prev => [...prev, ...newMonths]);
      setIsLoading(false);
    }, 100);
  }, [months, isLoading]);

  const loadPreviousMonths = useCallback(() => {
    if (isLoading || months.length === 0) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const firstMonth = months[0];
      let currentYear = firstMonth.year;
      let currentMonth = firstMonth.month - 1;
      
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      
      // Generate 2 months before the first month, avoiding duplicates
      const prevMonths: MonthData[] = [];
      const existingKeys = new Set(months.map(m => m.id));
      
      for (let i = 0; i < 2; i++) {
        const monthId = `${currentYear}-${currentMonth}`;
        if (!existingKeys.has(monthId)) {
          prevMonths.unshift(generateMonth(currentYear, currentMonth));
        }
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
      }
      
      setMonths(prev => [...prevMonths, ...prev]);
      setIsLoading(false);
    }, 100);
  }, [months, isLoading]);

  const getItemLayout = useCallback((data: MonthData[] | null | undefined, index: number) => {
    const ITEM_HEIGHT = 280; // Approximate height of each month
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    };
  }, []);

  const keyExtractor = useCallback((item: MonthData) => item.id, []);

  const renderMonth = useCallback(({ item }: { item: MonthData }) => (
    <MonthComponent item={item} />
  ), []);

  const renderFooter = useCallback(() => (
    isLoading ? (
      <View className="py-4 justify-center items-center">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    ) : null
  ), [isLoading]);

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={months}
        keyExtractor={keyExtractor}
        renderItem={renderMonth}
        onEndReached={loadMoreMonths}
        onEndReachedThreshold={0.1}
        onStartReached={loadPreviousMonths}
        onStartReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={3}
        getItemLayout={getItemLayout}
        ListFooterComponent={renderFooter}
        maintainVisibleContentPosition={{
          minIndexForVisible: 1,
        }}
      />
    </View>
  );
}