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
import { AdminHome, ShopDetailsApproval } from "./admin";
import { CarwashHome } from "./carwash";
import { UserAppointments, UserHistory, UserOwnedCars, UserHome } from "./user";
import { ViewPhoto } from "../components";

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
            <Stack.Screen
              name="CarwashSignup"
              component={CarwashSignup}
              options={{
                headerTitle: "Register your Carwash",
              }}
            />
          </>
        ) : privilege === "ADMIN" ? (
          <>
            <Stack.Screen
              name="AdminHome"
              component={AdminHome}
              options={{
                headerTitle: "Admin",
                headerRight: () => (
                  <TouchableOpacity onPress={() => auth.signOut()}>
                    <Icon name="logout" />
                  </TouchableOpacity>
                ),
                headerRightContainerStyle: tailwind("mr-2"),
              }}
            />
            <Stack.Screen
              name="ShopDetailsApproval"
              component={ShopDetailsApproval}
              options={{
                headerTitle: "Shop Details",
              }}
            />
          </>
        ) : privilege === "CARWASH_OWNER" ? (
          <>
            <Stack.Screen
              name="CarwashHome"
              component={CarwashHome}
              options={{
                headerTitle: "Home",
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
                headerTitle: "Home",
              }}
            />
            <Stack.Screen
              name="UserOwnedCars"
              component={UserOwnedCars}
              options={{
                headerTitle: "Owned Cars",
              }}
            />
            <Stack.Screen
              name="UserHistory"
              component={UserHistory}
              options={{
                headerTitle: "History",
              }}
            />
            <Stack.Screen
              name="UserAppointments"
              component={UserAppointments}
              options={{
                headerTitle: "Appointments",
              }}
            />
          </>
        )}
        <Stack.Screen
          name="ViewPhoto"
          component={ViewPhoto}
          options={{ headerTitle: "View Photo" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Wrapper;
