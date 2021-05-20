import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Icon, SearchBar } from "react-native-elements";
import tailwind from "tailwind-rn";
import { Divider } from "../../components";
import { DatabaseContext } from "../../contexts/DatabaseContext";
import { auth } from "../../lib/firebase";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { data } = useContext(DatabaseContext);
  const [query, setQuery] = useState("");
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
            Alert.alert("Profile Page", `Hi, ${data?.fullName ?? "User"}`);
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

      <View
        style={tailwind(
          "p-4 flex w-full flex-row items-center justify-between"
        )}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("UserOwnedCars")}
          style={tailwind("mr-2 flex-1 items-center justify-center")}
        >
          <Icon name="directions-car" type="material-icons" />
          <Text style={tailwind("text-xs text-gray-600")}>Owned Cars</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("UserHistory")}
          style={tailwind("mx-2 flex-1 items-center justify-center")}
        >
          <Icon name="history" type="material-icons" />
          <Text style={tailwind("text-xs text-gray-600")}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("UserAppointments")}
          style={tailwind("ml-2 flex-1 items-center justify-center")}
        >
          <Icon name="calendar" type="feather" />
          <Text style={tailwind("text-xs text-gray-600")}>Appointments</Text>
        </TouchableOpacity>
      </View>

      <Divider />

      <View style={tailwind("p-4")}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => console.log("Hello World")}
          containerStyle={tailwind(
            "bg-transparent border rounded border-gray-400 m-0 p-0"
          )}
          inputContainerStyle={tailwind("bg-transparent")}
          inputStyle={tailwind("text-sm")}
          placeholder="Search car wash shops..."
          platform={Platform.OS === "ios" ? "ios" : "android"}
        />
      </View>

      {/* <Button
        onPress={() =>
          Linking.openURL("https://waze.com/ul?ll=14.5311,121.0213&z=10")
        }
        title="APC on Waze"
      /> */}
    </ScrollView>
  );
};

export default Home;
