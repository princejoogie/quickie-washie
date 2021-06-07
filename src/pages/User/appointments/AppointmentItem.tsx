import { useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { db } from "../../../lib/firebase";
import {
  formatAppointmentDate,
  getAdditional,
  getTotalPrice,
} from "../../../lib/helpers";
import { Appointment, ShopProps } from "../../../types/data-types";

const AppointmentInfo: React.FC = ({ navigation }: any) => {
  const route = useRoute();
  const {
    appointment: { service, appointmentDate, shopID, vehicle: car, id },
  } = route.params as { appointment: Appointment };
  const date = new Date(appointmentDate);
  const [shop, setShop] = useState<ShopProps>();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    db.collection("users")
      .doc(shopID)
      .get()
      .then((snapshot) => {
        setLoading(false);
        setShop({ id: snapshot.id, ...snapshot.data() } as ShopProps);
      });

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Cancel Appointment?",
              "Are you sure you want to continue? This action cannot be undone.",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: async () => {
                    setDeleting(() => true);
                    await db.collection("appointments").doc(id).update({
                      status: "CANCELLED",
                    });
                    setDeleting(() => false);
                    navigation.popToTop();
                  },
                },
              ]
            );
          }}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Icon name="close" type="ion" />
          )}
        </TouchableOpacity>
      ),
      headerRightContainerStyle: tailwind("mr-2"),
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
                tailwind("bg-white rounded-t p-2 mt-1 flex-row items-center"),
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

        {shop && (
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                `https://www.waze.com/ul?ll=${shop.location.latitude}%2C${shop.location.longitude}&navigate=yes&zoom=17`
              );
            }}
            activeOpacity={0.5}
            style={tailwind(
              "flex flex-row items-center justify-center bg-blue-500 px-2 py-1 rounded-b"
            )}
          >
            <Text style={tailwind("text-xs mr-2 text-white")}>
              Open in Waze
            </Text>
            <Icon name="waze" type="font-awesome-5" size={18} color="#fff" />
          </TouchableOpacity>
        )}

        <Text style={tailwind("mt-3 text-xs text-gray-600")}>Service Type</Text>
        <View style={[tailwind("bg-white rounded p-2 mt-1"), { ...SHADOW_SM }]}>
          <Text style={tailwind("font-bold")}>{service.name}</Text>
          <Text style={tailwind("mt-2 text-xs text-gray-500")}>
            Price: <Text style={tailwind("text-black")}>₱{service.price}</Text>
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
          <Text style={tailwind("text-xs text-gray-500")}>
            Additional Price:{" "}
            <Text style={tailwind("text-black")}>
              ₱{getAdditional(service.additional, car.type)}
            </Text>
          </Text>
        </View>

        <View style={[tailwind("bg-white rounded p-2 mt-4"), { ...SHADOW_SM }]}>
          <View style={tailwind("items-center flex flex-row")}>
            <Text style={tailwind("text-sm text-gray-500")}>Total Price: </Text>
            <Text style={tailwind("text-sm font-bold")}>
              ₱{getTotalPrice(service, car.type)}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AppointmentInfo;
