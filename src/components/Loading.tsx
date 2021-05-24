import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import tailwind from "tailwind-rn";

const Loading: React.FC = () => {
  return (
    <View style={tailwind("flex flex-1 items-center justify-center")}>
      <ActivityIndicator size="large" color="#6B7280" />
      <Text style={tailwind("text-xs text-gray-600 mt-4")}>Loading...</Text>
    </View>
  );
};

export default Loading;
