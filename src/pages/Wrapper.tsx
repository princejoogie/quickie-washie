import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { CarwashSignup, EditProfile, Login, Signup } from "./";
import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import { DatabaseContext } from "../contexts/DatabaseContext";
import { AdminHome, ShopDetailsApproval } from "./Admin";
import { CarwashHome, CProfile, Feedbacks, ShopReports } from "./Carwash";
import { UserOwnedCarsWrapper, UserHome } from "./User";
import { Loading, ViewPhoto } from "../components";
import ShopWrapper from "./User/ShopWrapper";
import ServicesWrapper from "./Carwash/ServicesWrapper";
import AppointmentWrapper from "./User/AppointmentWrapper";
import HistoryWrapper from "./User/HistoryWrapper";
import ShopAppointmentWrapper from "./Carwash/ShopAppointmentWrapper";

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
              options={{ headerTitle: "Edit Profile" }}
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
              component={ShopAppointmentWrapper}
              options={{ headerShown: false }}
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
              component={HistoryWrapper}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="UserAppointments"
              component={AppointmentWrapper}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
        <Stack.Screen
          name="ViewPhoto"
          component={ViewPhoto}
          options={{ headerTitle: "View Photo" }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerTitle: "Edit Profile" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Wrapper;
