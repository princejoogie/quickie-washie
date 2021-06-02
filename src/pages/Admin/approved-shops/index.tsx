import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ApprovedShops from "./ApprovedShops";

const Stack = createStackNavigator();

const ApprovedShopsWrapper: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ApprovedShops"
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <Stack.Screen
        name="ApprovedShops"
        component={ApprovedShops}
        options={{ headerTitle: "Approved Shops" }}
      />
    </Stack.Navigator>
  );
};

export default ApprovedShopsWrapper;
