import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { AddService, Services, UpdateService } from "./services";

const Stack = createStackNavigator();

const ServicesWrapper: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="Services"
        component={Services}
        options={{ headerTitle: "Services" }}
      />

      <Stack.Screen
        name="AddService"
        component={AddService}
        options={{ headerTitle: "Add a Service" }}
      />

      <Stack.Screen
        name="UpdateService"
        component={UpdateService}
        options={{ headerTitle: "Update Service" }}
      />
    </Stack.Navigator>
  );
};

export default ServicesWrapper;
