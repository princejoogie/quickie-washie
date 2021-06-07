import React from "react";
import { View } from "react-native";
import tailwind from "tailwind-rn";

interface DividerProps {
  color?: string;
  className?: string;
}

const Divider: React.FC<DividerProps> = ({
  color = "bg-gray-300",
  className = "",
}) => {
  return (
    <View style={tailwind(`px-4 ${className}`)}>
      <View style={tailwind(`w-full h-px ${color}`)} />
    </View>
  );
};

export default Divider;
