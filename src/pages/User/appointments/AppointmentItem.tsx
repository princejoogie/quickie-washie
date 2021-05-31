import { useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-elements";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { db } from "../../../lib/firebase";
import { formatAppointmentDate } from "../../../lib/helpers";
import { AppoitmentItem, ShopProps } from "../../../types/data-types";

const AppointmentInfo: React.FC = () => {
  const route = useRoute();
  const {
    appointment: { service, appointmentDate, shopID, vehicle: car, id },
  } = route.params as { appointment: AppoitmentItem };
  const date = new Date(appointmentDate);
  const [shop, setShop] = useState<ShopProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.collection("users")
      .doc(shopID)
      .get()
      .then((snapshot) => {
        setLoading(false);
        setShop({ id: snapshot.id, ...snapshot.data() } as ShopProps);
      });
  }, []);

  return (
    <ScrollView style={tailwind("flex-1")}>
      <View style={tailwind("p-4")}>
        <Text style={tailwind("text-xs text-gray-600")}>Reference Number</Text>
        <View
          style={[
            tailwind("bg-white rounded p-2 mt-1 flex-row items-center"),
            { ...SHADOW_SM },
          ]}
        >
          <Text selectable style={tailwind("text-xs text-black font-bold")}>
            {id}
          </Text>
        </View>

        <Text style={tailwind("text-xs mt-3 text-gray-600")}>Carwash Shop</Text>
        {loading ? (
          <View
            style={[
              tailwind(
                "bg-white rounded p-2 mt-1 flex-row items-center justify-center"
              ),
              { ...SHADOW_SM },
            ]}
          >
            <ActivityIndicator size="small" color="#000" />
          </View>
        ) : (
          shop && (
            <View
              style={[
                tailwind("bg-white rounded p-2 mt-1 flex-row items-center"),
                { ...SHADOW_SM },
              ]}
            >
              <Avatar
                size="medium"
                containerStyle={tailwind("bg-gray-300")}
                rounded
                source={shop.photoURL ? { uri: shop.photoURL } : undefined}
                icon={{ type: "feather", name: "image" }}
              />

              <View
                style={tailwind("ml-4 flex items-start justify-center flex-1")}
              >
                <Text numberOfLines={2} style={tailwind("font-bold")}>
                  {shop.shopName ?? "Shop Name"}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    Linking.openURL(
                      `mailto:${shop.email}?subject=Appointment Booking`
                    );
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={tailwind("mt-1 text-xs underline text-blue-500")}
                  >
                    {shop.email ?? "email@example.com"}
                  </Text>
                </TouchableOpacity>

                <View style={tailwind("flex flex-row items-center")}>
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

                  <Text style={tailwind("mx-2 text-gray-600")}>|</Text>

                  <Text style={tailwind("text-xs text-gray-600")}>
                    {shop.city}
                  </Text>
                </View>
              </View>
            </View>
          )
        )}

        <Text style={tailwind("mt-3 text-xs text-gray-600")}>Service Type</Text>
        <View style={[tailwind("bg-white rounded p-2 mt-1"), { ...SHADOW_SM }]}>
          <Text style={tailwind("font-bold")}>{service.name}</Text>
          <Text style={tailwind("mt-2 text-xs text-gray-500")}>
            Price Range:{" "}
            <Text style={tailwind("text-black")}>{service.priceRange}</Text>
          </Text>
          <Text style={tailwind("text-xs text-gray-500")}>
            Description:{" "}
            <Text style={tailwind("text-black")}>{service.description}</Text>
          </Text>
        </View>

        <Text style={tailwind("mt-3 text-xs text-gray-600")}>
          Appointment Date
        </Text>
        <View style={[tailwind("bg-white rounded p-2 mt-1"), { ...SHADOW_SM }]}>
          <Text style={tailwind("font-bold")}>
            {formatAppointmentDate(date, date)}
          </Text>
        </View>

        <Text style={tailwind("mt-3 text-xs text-gray-600")}>
          Selected Vehicle
        </Text>
        <View style={[tailwind("bg-white rounded p-2 mt-1"), { ...SHADOW_SM }]}>
          <Text style={tailwind("font-bold")}>{car.plateNumber}</Text>
          <View style={tailwind("items-center flex flex-row")}>
            <Text style={tailwind("text-xs text-gray-500")}>Type: </Text>
            <Text style={tailwind("text-xs")}>{car.type}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AppointmentInfo;
