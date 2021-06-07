import { useRoute } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
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
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db, timestamp } from "../../../lib/firebase";
import {
  formatAppointmentDate,
  getAdditional,
  getTotalPrice,
} from "../../../lib/helpers";
import { CarProp, Service, ShopProps } from "../../../types/data-types";

const AppointmentSummary: React.FC = ({ navigation }: any) => {
  const { user } = useContext(DatabaseContext);
  const route = useRoute();
  const { service, shop, appointmentDate, car } = route.params as {
    shop: ShopProps;
    service: Service;
    appointmentDate: string;
    car: CarProp;
  };
  const date = new Date(appointmentDate);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Confirm",
              "Are you sure you want to discard changes?",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    navigation.popToTop();
                  },
                },
              ]
            );
          }}
        >
          <Icon name="close" type="ion" />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: tailwind("mr-2"),
    });
  }, []);

  return (
    <View style={tailwind("flex flex-1")}>
      <View style={tailwind("absolute z-50 bottom-2 inset-x-2")}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Confirmation",
              `Details are correct and book the appointment on: \n\n${formatAppointmentDate(
                date,
                date
              )}`,
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "Ok",
                  onPress: async () => {
                    setLoading(() => true);
                    if (user) {
                      await db.collection("appointments").add({
                        shopID: shop.id,
                        userID: user.uid,
                        service,
                        appointmentDate,
                        vehicle: car,
                        status: "ON-GOING",
                        totalPrice: getTotalPrice(service, car.type),
                        timestamp: timestamp(),
                      });
                      setLoading(() => false);

                      Alert.alert(
                        "Appointment Booked!",
                        "Check your profile to see list of appointments.",
                        [
                          {
                            text: "Ok",
                            onPress: () => {
                              navigation.popToTop();
                            },
                            style: "cancel",
                          },
                        ]
                      );
                    } else {
                      setLoading(() => false);
                    }
                  },
                },
              ]
            );
          }}
          disabled={loading}
          activeOpacity={0.5}
          style={tailwind(
            `flex mt-2 flex-row p-2 rounded items-center justify-center ${
              loading ? "bg-gray-300" : "bg-green-500"
            }`
          )}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={tailwind("text-white")}>Confirm Appointment</Text>
          )}
          <View style={tailwind("absolute right-2")}>
            <Icon name="check" type="feather" color="#ffffff" />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView style={tailwind("flex-1")}>
        <View style={tailwind("p-4")}>
          <Text style={tailwind("text-xs text-gray-600")}>Carwash Shop</Text>
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

          <Text style={tailwind("mt-3 text-xs text-gray-600")}>
            Service Type
          </Text>
          <View
            style={[tailwind("bg-white rounded p-2 mt-1"), { ...SHADOW_SM }]}
          >
            <Text style={tailwind("font-bold")}>{service.name}</Text>
            <Text style={tailwind("mt-2 text-xs text-gray-500")}>
              Price:{" "}
              <Text style={tailwind("text-black")}>₱{service.price}</Text>
            </Text>
            <Text style={tailwind("text-xs text-gray-500")}>
              Description:{" "}
              <Text style={tailwind("text-black")}>{service.description}</Text>
            </Text>
          </View>

          <Text style={tailwind("mt-3 text-xs text-gray-600")}>
            Appointment Date
          </Text>
          <View
            style={[tailwind("bg-white rounded p-2 mt-1"), { ...SHADOW_SM }]}
          >
            <Text style={tailwind("font-bold")}>
              {formatAppointmentDate(date, date)}
            </Text>
          </View>

          <Text style={tailwind("mt-3 text-xs text-gray-600")}>
            Selected Vehicle
          </Text>
          <View
            style={[tailwind("bg-white rounded p-2 mt-1"), { ...SHADOW_SM }]}
          >
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

          <View
            style={[tailwind("bg-white rounded p-2 mt-4"), { ...SHADOW_SM }]}
          >
            <View style={tailwind("items-center flex flex-row")}>
              <Text style={tailwind("text-sm text-gray-500")}>
                Total Price:{" "}
              </Text>
              <Text style={tailwind("text-sm font-bold")}>
                ₱{getTotalPrice(service, car.type)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AppointmentSummary;
