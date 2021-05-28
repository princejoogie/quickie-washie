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
import { AdminHome, ShopDetailsApproval } from "./Admin";
import {
  CarwashHome,
  CProfile,
  Feedbacks,
  ShopAppointments,
  ShopReports,
} from "./Carwash";
import {
  UserAppointments,
  UserHistory,
  UserOwnedCarsWrapper,
  UserHome,
  UProfile,
} from "./User";
import { Loading, ViewPhoto } from "../components";
import ShopWrapper from "./User/car-shop/ShopWrapper";
import ServicesWrapper from "./Carwash/ServicesWrapper";

const Stack = createStackNavigator();

const Wrapper: React.FC = () => {
  const { user, privilege, loading } = useContext(DatabaseContext);

  if (loading) return <Loading />;

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
                headerTitle: "Carwash Shop",
              }}
            />
            <Stack.Screen
              name="CProfile"
              component={CProfile}
              options={{ headerTitle: "Profile" }}
            />
            <Stack.Screen
              name="ShopReports"
              component={ShopReports}
              options={{ headerTitle: "Reports" }}
            />
            <Stack.Screen
              name="ShopFeedbacks"
              component={Feedbacks}
              options={{ headerTitle: "Feedbacks" }}
            />
            <Stack.Screen
              name="ShopAppointments"
              component={ShopAppointments}
              options={{ headerTitle: "Appointments" }}
            />
            <Stack.Screen
              name="ShopServicesWrapper"
              component={ServicesWrapper}
              options={{ headerShown: false }}
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
              name="ShopWrapper"
              component={ShopWrapper}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UserOwnedCars"
              component={UserOwnedCarsWrapper}
              options={{
                headerShown: false,
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
            <Stack.Screen
              name="UserProfile"
              component={UProfile}
              options={{
                headerTitle: "Edit Profile",
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
