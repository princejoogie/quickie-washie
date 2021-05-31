import React from "react";
import { ScrollView, Text, View } from "react-native";
import tailwind from "tailwind-rn";

const Appointments: React.FC = () => {
  return (
    <ScrollView>
      <View style={tailwind("p-4")}>
        <Text>Hello World</Text>
      </View>
    </ScrollView>
  );
};

export default Appointments;
