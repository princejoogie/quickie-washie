import React, { useContext } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { DatabaseContext } from "../../contexts/DatabaseContext";

interface CarwashHomeProps {}

const CarwashHome: React.FC<CarwashHomeProps> = () => {
  const { data } = useContext(DatabaseContext);

  if (!data) {
    return (
      <View style={tailwind("flex flex-1 items-center justify-center")}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (data.approved) {
    return (
      <View>
        <Text>Approved</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Not Approved</Text>
    </View>
  );
};
export default CarwashHome;
