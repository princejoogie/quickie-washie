import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { ShopAppointmentItem, ShopAppointments } from "./appointments/";

const Stack = createStackNavigator();

const ShopAppointmentWrapper: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Appointments"
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <Stack.Screen name="Appointments" component={ShopAppointments} />
      <Stack.Screen
        name="AppointmentItem"
        component={ShopAppointmentItem}
        options={{
          headerTitle: "Appointment Item",
        }}
      />
    </Stack.Navigator>
  );
};

export default ShopAppointmentWrapper;