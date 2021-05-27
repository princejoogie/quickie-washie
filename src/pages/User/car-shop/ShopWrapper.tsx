import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { SelectAppointmentDate, SelectVehicle, ShopDetail } from ".";
import { firebase } from "../../../lib/firebase";
import { useRoute } from "@react-navigation/core";

const ShopStack = createStackNavigator();

const ShopWrapper: React.FC = () => {
  const route = useRoute();
  const { shop } = route.params as { shop: firebase.firestore.DocumentData };

  return (
    <ShopStack.Navigator
      initialRouteName="ShopDetail"
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <ShopStack.Screen
        initialParams={{ shop }}
        name="ShopDetail"
        component={ShopDetail}
        options={{ headerTitle: "Shop Detail" }}
      />
      <ShopStack.Screen
        name="SelectAppointmentDate"
        component={SelectAppointmentDate}
        options={{ headerTitle: "Select a Date" }}
      />
      <ShopStack.Screen
        name="SelectVehicle"
        component={SelectVehicle}
        options={{ headerTitle: "Choose a Vehicle" }}
      />
    </ShopStack.Navigator>
  );
};

export default ShopWrapper;
