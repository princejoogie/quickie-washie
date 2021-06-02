import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import PendingUserDeactivation from "./PendingUserDeactivation";

const Stack = createStackNavigator();

const UserDeactivationWrapper: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="UserDeactivation"
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <Stack.Screen
        name="UserDeactivation"
        component={PendingUserDeactivation}
        options={{ headerTitle: "Deactivation Requests" }}
      />
    </Stack.Navigator>
  );
};

export default UserDeactivationWrapper;
