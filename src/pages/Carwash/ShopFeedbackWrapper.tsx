import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Feedbacks from "./feedbacks";
import FeedbackItem from "./feedbacks/FeedbackItem";

const Stack = createStackNavigator();

const ShopFeedbackWrapper: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Feedbacks"
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <Stack.Screen name="Feedbacks" component={Feedbacks} />
      <Stack.Screen
        name="FeedbackItem"
        component={FeedbackItem}
        options={{ headerTitle: "Feedback Item" }}
      />
    </Stack.Navigator>
  );
};

export default ShopFeedbackWrapper;
