import React from "react";
import { View } from "react-native";
import tailwind from "tailwind-rn";

interface SpacerProps {
  style?: string;
}

const Spacer: React.FC<SpacerProps> = ({ style = "h-20" }) => {
  return <View style={tailwind(`w-full bg-transparent ${style}`)} />;
};

export default Spacer;
