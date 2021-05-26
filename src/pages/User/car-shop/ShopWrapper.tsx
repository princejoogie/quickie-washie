import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { ShopDetail } from ".";
import { firebase } from "../../../lib/firebase";
import { useRoute } from "@react-navigation/core";

const Stack = createStackNavigator();

const ShopWrapper: React.FC = () => {
  const route = useRoute();
  const { shop } = route.params as { shop: firebase.firestore.DocumentData };

  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        initialParams={{ shop }}
        name="ShopDetail"
        component={ShopDetail}
        options={{ headerTitle: "Shop Detail" }}
      />
    </Stack.Navigator>
  );
};

export default ShopWrapper;
