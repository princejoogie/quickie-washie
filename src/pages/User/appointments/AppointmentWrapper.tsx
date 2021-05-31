import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Appointments, AppointmentItem } from "./";

const Stack = createStackNavigator();

const AppointmentWrapper: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Appointments"
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <Stack.Screen name="Appointments" component={Appointments} />

      <Stack.Screen
        name="AppointmentItem"
        component={AppointmentItem}
        options={{ headerTitle: "Appointment Item" }}
      />
    </Stack.Navigator>
  );
};

export default AppointmentWrapper;
