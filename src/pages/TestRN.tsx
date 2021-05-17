import React from "react";
import { View } from "react-native";
import tailwind from "tailwind-rn";

interface TestRNProps {}

const TestRN: React.FC<TestRNProps> = () => {
  return (
    <View style={tailwind("flex flex-1 items-center justify-center")}>
      <View style={tailwind("h-20 w-20 bg-red-500 rounded")} />
    </View>
  );
};

export default TestRN;
