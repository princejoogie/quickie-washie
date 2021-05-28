import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { Divider, Spacer } from "../../components";
import { PendingCarwashList } from "../../components/admin";
import { AdminContext } from "../../contexts/Admin/AdminContext";
import { DatabaseContext } from "../../contexts/DatabaseContext";
import { auth } from "../../lib/firebase";

interface HomeProps {}

const AdminHome: React.FC<HomeProps> = () => {
  const { data } = useContext(DatabaseContext);
  const { nCustomer, nOwner, nAdmin } = useContext(AdminContext);
  const totalUsers = nCustomer + nOwner + nAdmin;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => auth.signOut()}>
          <Icon name="logout" />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: tailwind("mr-2"),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("EditProfile");
          }}
        >
          <Icon name="user" type="feather" />
        </TouchableOpacity>
      ),
      headerLeftContainerStyle: tailwind("ml-2"),
    });
  }, []);

  return (
    <ScrollView style={tailwind("flex flex-1")}>
      <View style={tailwind("w-full flex flex-row bg-gray-200 p-4")}>
        <Avatar
          size="large"
          containerStyle={tailwind("bg-gray-300")}
          rounded
          source={data?.photoURL ? { uri: data.photoURL } : undefined}
          icon={{ type: "feather", name: "image" }}
        />

        <View style={tailwind("ml-4 flex justify-center flex-1")}>
          <Text numberOfLines={1} style={tailwind("text-lg")}>
            {data?.fullName ?? "Full Name"}
          </Text>
          <Text numberOfLines={1} style={tailwind("text-gray-500")}>
            {data?.email ?? "email@example.com"}
          </Text>
          <Text
            numberOfLines={1}
            style={tailwind("mt-1 text-xs text-gray-500")}
          >
            {data?.phoneNumber ?? "phone"}
          </Text>
        </View>
      </View>

      <View style={tailwind("p-4 w-full")}>
        <View
          style={tailwind("w-full flex flex-row items-center justify-between")}
        >
          <Text>Number of Users</Text>
          <Text style={tailwind("text-gray-500 text-xs")}>
            {totalUsers} users
          </Text>
        </View>

        <View style={tailwind("w-full mt-2")}>
          <Text style={tailwind("text-xs text-gray-500")}>
            {nCustomer} Customers
          </Text>
          <View
            style={[
              tailwind("h-6 bg-red-300 rounded-lg mt-1"),
              { width: `${(nCustomer / totalUsers) * 100}%` },
            ]}
          />
        </View>

        <View style={tailwind("w-full mt-2")}>
          <Text style={tailwind("text-xs text-gray-500")}>
            {nOwner} Shop Owners
          </Text>
          <View
            style={[
              tailwind("h-6 bg-green-300 rounded-lg mt-1"),
              { width: `${(nOwner / totalUsers) * 100}%` },
            ]}
          />
        </View>

        <View style={tailwind("w-full mt-2")}>
          <Text style={tailwind("text-xs text-gray-500")}>{nAdmin} Admins</Text>
          <View
            style={[
              tailwind("h-6 bg-blue-300 rounded-lg mt-1"),
              { width: `${(nAdmin / totalUsers) * 100}%` },
            ]}
          />
        </View>
      </View>

      <Divider />

      <View style={tailwind("py-2 px-6")}>
        <TouchableOpacity>
          <Text>Approved Carwash Shops </Text>
        </TouchableOpacity>
      </View>

      <Divider />

      <PendingCarwashList />

      <Spacer />
    </ScrollView>
  );
};

export default AdminHome;
