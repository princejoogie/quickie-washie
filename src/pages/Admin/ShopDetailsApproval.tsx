import React from "react";
import { ScrollView, Text } from "react-native";
import tailwind from "tailwind-rn";

const ShopDetailsApproval: React.FC = () => {
  return (
    <ScrollView style={tailwind("flex flex-1")}>
      <Text>Hello World</Text>
    </ScrollView>
  );
};

export default ShopDetailsApproval;
