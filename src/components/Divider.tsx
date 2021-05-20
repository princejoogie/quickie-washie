import React from "react";
import { View } from "react-native";
import tailwind from "tailwind-rn";

interface DividerProps {
  color?: string;
}

const Divider: React.FC<DividerProps> = ({ color = "bg-gray-300" }) => {
  return (
    <View style={tailwind("px-4")}>
      <View style={tailwind(`w-full h-px ${color}`)} />
    </View>
  );
};

export default Divider;
