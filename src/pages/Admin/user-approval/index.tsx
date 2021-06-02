import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import PendingUserApproval from "./PendingUserApproval";
import UserDetails from "./UserDetails";

const Stack = createStackNavigator();

const UserApprovalWrapper: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="UserApproval"
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <Stack.Screen
        name="UserApproval"
        component={PendingUserApproval}
        options={{ headerTitle: "Pending Users" }}
      />
      <Stack.Screen
        name="UserDetails"
        component={UserDetails}
        options={{ headerTitle: "User Details" }}
      />
    </Stack.Navigator>
  );
};

export default UserApprovalWrapper;
