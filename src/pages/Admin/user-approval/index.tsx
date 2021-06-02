import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import PendingUserApproval from "./PendingUserApproval";

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
    </Stack.Navigator>
  );
};

export default UserApprovalWrapper;
