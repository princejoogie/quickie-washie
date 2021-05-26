import { useNavigation, useRoute } from "@react-navigation/core";
import React from "react";
import {
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import tailwind from "tailwind-rn";
import { WIDTH } from "../../../constants";
import { ShopProps } from "../../../types/data-types";

const ShopDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { shop } = route.params as { shop: ShopProps };

  return (
    <View style={tailwind("flex flex-1")}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SelectAppointmentDate", { shop });
        }}
        activeOpacity={0.5}
        style={tailwind(
          "absolute z-50 bottom-2 inset-x-2 p-2 bg-green-500 rounded items-center justify-center"
        )}
      >
        <Text style={tailwind("text-white rounded")}>Book an Appointment</Text>
      </TouchableOpacity>

      <ScrollView>
        <View style={tailwind("w-full flex flex-row bg-gray-200 p-4")}>
          <Avatar
            size="large"
            containerStyle={tailwind("bg-gray-300")}
            rounded
            source={shop?.photoURL ? { uri: shop.photoURL } : undefined}
            icon={{ type: "feather", name: "image" }}
          />

          <View style={tailwind("ml-4 flex items-start justify-center flex-1")}>
            <Text numberOfLines={1} style={tailwind("text-lg")}>
              {shop.shopName ?? "Shop Name"}
            </Text>
            <Text numberOfLines={1} style={tailwind("text-gray-500")}>
              {shop.email ?? "email@example.com"}
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                if (Platform.OS === "android") {
                  Linking.openURL(`tel:${shop.phoneNumber}`);
                } else {
                  Linking.openURL(`telprompt:${shop.phoneNumber}`);
                }
              }}
            >
              <Text
                numberOfLines={1}
                style={tailwind("mt-1 text-xs underline text-blue-500")}
              >
                {shop.phoneNumber ?? "phone"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={tailwind("p-4")}>
          <Text>Services</Text>
          <View
            style={tailwind(
              "w-full flex flex-row items-center justify-between"
            )}
          >
            <Text>Location</Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  `https://www.waze.com/ul?ll=${shop.location.latitude}%2C${shop.location.longitude}&navigate=yes&zoom=17`
                );
              }}
              activeOpacity={0.5}
              style={tailwind(
                "flex flex-row items-center justify-center bg-blue-500 px-2 py-1 rounded"
              )}
            >
              <Text style={tailwind("text-xs mr-2 text-white")}>
                Open in Waze
              </Text>
              <Icon name="waze" type="font-awesome-5" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <View
            style={tailwind(
              "border border-gray-300 rounded-md overflow-hidden mt-2"
            )}
          >
            <MapView
              initialRegion={{
                latitude: shop.location.latitude,
                longitude: shop.location.longitude,
                latitudeDelta: 0.04922,
                longitudeDelta: 0.04421,
              }}
              style={[tailwind("w-full"), { height: WIDTH * (2 / 3) }]}
            >
              <Marker
                coordinate={{
                  latitude: shop.location.latitude,
                  longitude: shop.location.longitude,
                }}
              />
            </MapView>
          </View>
        </View>
        <View style={tailwind("w-full h-20")} />
      </ScrollView>
    </View>
  );
};

export default ShopDetail;
