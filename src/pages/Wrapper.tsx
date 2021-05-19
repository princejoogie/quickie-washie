import React, { useContext } from "react";
import tailwind from "tailwind-rn";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { CarwashSignup, Login, Signup } from "./";
import { StatusBar } from "expo-status-bar";
import { Icon } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";
import { DatabaseContext } from "../contexts/DatabaseContext";
import { auth } from "../lib/firebase";
import { AdminHome } from "./Admin";
import { CarwashHome } from "./Carwash";
import { UserHome } from "./User";

const Stack = createStackNavigator();

const Wrapper: React.FC = () => {
  const { user, privilege } = useContext(DatabaseContext);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="CarwashSignup" component={CarwashSignup} />
          </>
        ) : privilege === "ADMIN" ? (
          <>
            <Stack.Screen
              name="AdminHome"
              component={AdminHome}
              options={{
                headerRight: () => (
                  <TouchableOpacity onPress={() => auth.signOut()}>
                    <Icon name="logout" />
                  </TouchableOpacity>
                ),
                headerRightContainerStyle: tailwind("mr-2"),
              }}
            />
          </>
        ) : privilege === "CARWASH_OWNER" ? (
          <>
            <Stack.Screen
              name="CarwashHome"
              component={CarwashHome}
              options={{
                headerRight: () => (
                  <TouchableOpacity onPress={() => auth.signOut()}>
                    <Icon name="logout" />
                  </TouchableOpacity>
                ),
                headerRightContainerStyle: tailwind("mr-2"),
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="UserHome"
              component={UserHome}
              options={{
                headerRight: () => (
                  <TouchableOpacity onPress={() => auth.signOut()}>
                    <Icon name="logout" />
                  </TouchableOpacity>
                ),
                headerRightContainerStyle: tailwind("mr-2"),
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Wrapper;
