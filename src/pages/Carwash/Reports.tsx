import React from "react";
import { Text, View } from "react-native";
import tailwind from "tailwind-rn";

const Reports: React.FC = () => {
  return (
    <View>
      <Text style={tailwind("text-center mt-4")}>No Reports</Text>
    </View>
  );
};

export default Reports;
