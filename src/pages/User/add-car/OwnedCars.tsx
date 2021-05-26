import { useNavigation } from "@react-navigation/core";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import tailwind from "tailwind-rn";

const OwnedCars: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={tailwind("flex flex-1")}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SelectCarType", { hello: "Hello" });
        }}
        activeOpacity={0.7}
        style={tailwind(
          "p-2 rounded-full bg-blue-500 z-50 absolute bottom-4 right-4"
        )}
      >
        <Icon name="plus" type="feather" color="#FFFFFF" />
      </TouchableOpacity>
      <ScrollView style={tailwind("flex flex-1")}>
        <Text>Owned Cars List</Text>
      </ScrollView>
    </View>
  );
};

export default OwnedCars;
