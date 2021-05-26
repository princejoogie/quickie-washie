import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { OwnedCars, SelectCarType } from "./add-car";

const Stack = createStackNavigator();

const OwnedCarsWrapper: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="OwnedCars"
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <Stack.Screen
        name="OwnedCars"
        component={OwnedCars}
        options={{ headerTitle: "Owned Cars" }}
      />
      <Stack.Screen
        name="SelectCarType"
        component={SelectCarType}
        options={{ headerTitle: "Add Car" }}
      />
    </Stack.Navigator>
  );
};

export default OwnedCarsWrapper;
