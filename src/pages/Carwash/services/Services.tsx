import { useNavigation } from "@react-navigation/core";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { Spacer } from "../../../components";
import { SHADOW_SM } from "../../../constants";

interface ServicesProps {}

const Services: React.FC<ServicesProps> = () => {
  const navigation = useNavigation();

  return (
    <View style={tailwind("flex flex-1")}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("AddService");
        }}
        activeOpacity={0.7}
        style={tailwind(
          "p-2 rounded-full bg-blue-500 z-50 absolute bottom-4 right-4"
        )}
      >
        <Icon name="plus" type="feather" color="#FFFFFF" />
      </TouchableOpacity>
      <ScrollView style={tailwind("flex flex-1")}>
        <View style={tailwind("px-4 pt-2 pb-4")}>
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <ServiceItem key={`service-${i}`} i={i} />
            ))}
        </View>

        <Spacer />
      </ScrollView>
    </View>
  );
};

interface ServiceProps {
  i: number;
}

const ServiceItem: React.FC<ServiceProps> = ({ i }) => {
  return (
    <TouchableOpacity
      onPress={() => {}}
      activeOpacity={0.7}
      style={[tailwind("flex flex-row p-2 bg-white mt-2"), { ...SHADOW_SM }]}
    >
      <View style={tailwind("flex-1")}>
        <Text style={tailwind("font-bold")}>Service {i}</Text>
        <View style={tailwind("items-center flex flex-row")}>
          <Text style={tailwind("text-xs text-gray-500")}>Type: </Text>
          <Text style={tailwind("text-xs")}>price-range</Text>
        </View>
      </View>

      <View style={tailwind("items-center justify-center")}>
        <Icon name="chevron-right" type="feather" color="#4B5563" />
      </View>
    </TouchableOpacity>
  );
};
export default Services;
