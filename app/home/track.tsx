import ScrollableCalendar from "@/modules/home/components/Calendar";
import { View } from "react-native";

export default function CalendarScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollableCalendar />
    </View>
  );
}
