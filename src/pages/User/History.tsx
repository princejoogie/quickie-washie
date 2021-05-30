import React from "react";
import { Text, View } from "react-native";
import tailwind from "tailwind-rn";

interface HistoryProps {}

const History: React.FC<HistoryProps> = () => {
  return (
    <View>
      <Text style={tailwind("mt-4 text-center")}>No History</Text>
    </View>
  );
};

export default History;
