import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { History, HistoryItem } from "./history";

const Stack = createStackNavigator();

const HistoryWrapper: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="History"
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="HistoryItem" component={HistoryItem} />
    </Stack.Navigator>
  );
};

export default HistoryWrapper;
