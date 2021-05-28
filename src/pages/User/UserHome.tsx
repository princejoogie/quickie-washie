import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Icon, SearchBar } from "react-native-elements";
import tailwind from "tailwind-rn";
import { Divider, Spacer } from "../../components";
import { DatabaseContext } from "../../contexts/DatabaseContext";
import { auth } from "../../lib/firebase";
import { SHADOW_SM } from "../../constants";
import { AdminContext } from "../../contexts/Admin/AdminContext";
import { ShopProps } from "../../types/data-types";

interface Item {
  shop: ShopProps;
}

const CarwashItem: React.FC<Item> = ({ shop }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ShopWrapper", { shop });
      }}
      activeOpacity={0.7}
      style={[
        tailwind("bg-white rounded-md p-3 flex flex-row mt-2"),
        { ...SHADOW_SM },
      ]}
    >
      <View style={tailwind("flex-1")}>
        <View>
          <Text style={tailwind("font-bold text-lg")}>{shop.shopName}</Text>
        </View>

        <View style={tailwind("flex w-full flex-row mt-2")}>
          <Avatar
            rounded
            containerStyle={tailwind("bg-gray-300")}
            size="medium"
            source={shop.photoURL ? { uri: shop.photoURL } : undefined}
            icon={{ type: "feather", name: "image" }}
          />

          <View style={tailwind("ml-2 flex justify-center")}>
            <Text style={tailwind("text-xs text-gray-600")}>
              {shop.fullName}
            </Text>
            <Text style={tailwind("text-xs text-gray-600")}>
              {shop.phoneNumber}
            </Text>
            <Text style={tailwind("text-xs text-gray-600")}>{shop.city}</Text>
          </View>
        </View>
      </View>

      <View style={tailwind("flex items-end justify-between")}>
        <Icon name="chevron-right" type="feather" color="#4B5563" />
      </View>
    </TouchableOpacity>
  );
};

const Home: React.FC = () => {
  const { data } = useContext(DatabaseContext);
  const { approvedShops } = useContext(AdminContext);
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
            navigation.navigate("EditProfile");
          }}
        >
          <Icon name="user" type="feather" />
        </TouchableOpacity>
      ),
      headerLeftContainerStyle: tailwind("ml-2"),
    });
  }, []);

  const searchCarwash = async (text: string) => {
    console.log({ text });
  };

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
          onSubmitEditing={() => searchCarwash(query)}
          containerStyle={tailwind(
            "bg-transparent border rounded border-gray-400 m-0 p-0"
          )}
          inputContainerStyle={tailwind("bg-transparent")}
          inputStyle={tailwind("text-sm")}
          placeholder="Search car wash shops..."
          platform={Platform.OS === "ios" ? "ios" : "android"}
        />
      </View>

      <View style={tailwind("px-4 pb-4")}>
        <Text style={tailwind("text-xs text-gray-600")}>
          Carwash Shops Available
        </Text>

        {approvedShops.map((shop) => (
          <CarwashItem key={shop.id} shop={shop as ShopProps} />
        ))}
      </View>

      <Spacer />
    </ScrollView>
  );
};

export default Home;
