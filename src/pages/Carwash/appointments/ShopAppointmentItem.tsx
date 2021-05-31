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
import { Avatar } from "react-native-elements";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { db } from "../../../lib/firebase";
import { formatAppointmentDate } from "../../../lib/helpers";
import { AppoitmentItem, User } from "../../../types/data-types";

const ShopAppointmentItem: React.FC = ({ navigation }: any) => {
  const route = useRoute();
  const {
    appointment: { service, appointmentDate, vehicle: car, id, userID, status },
  } = route.params as { appointment: AppoitmentItem };
  const date = new Date(appointmentDate);
  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState(true);
  const ongoing = status === "ON-GOING";

  useEffect(() => {
    db.collection("users")
      .doc(userID)
      .get()
      .then((snapshot) => {
        setLoading(false);
        setUserData({ id: snapshot.id, ...snapshot.data() } as User);
      });
  }, []);

  return (
    <ScrollView style={tailwind("flex-1")}>
      <View style={tailwind("p-4")}>
        <Text style={tailwind("text-xs text-gray-600")}>Status</Text>
        <View
          style={[
            tailwind("bg-white rounded p-2 mt-1 flex-row items-center"),
            { ...SHADOW_SM },
          ]}
        >
          <Text
            style={tailwind(
              `font-bold ${
                status === "CANCELLED" ? "text-red-500" : "text-green-700"
              }`
            )}
          >
            {status}
          </Text>
        </View>

        <Text style={tailwind("text-xs mt-3 text-gray-600")}>
          Reference Number
        </Text>
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

        <Text style={tailwind("text-xs mt-3 text-gray-600")}>User Data</Text>
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
          userData && (
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
                source={
                  userData.photoURL ? { uri: userData.photoURL } : undefined
                }
                icon={{ type: "feather", name: "image" }}
              />

              <View
                style={tailwind("ml-4 flex items-start justify-center flex-1")}
              >
                <Text numberOfLines={2} style={tailwind("font-bold")}>
                  {userData.fullName ?? "Shop Name"}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    Linking.openURL(
                      `mailto:${userData.email}?subject=Appointment Booking`
                    );
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={tailwind("mt-1 text-xs underline text-blue-500")}
                  >
                    {userData.email ?? "email@example.com"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    if (Platform.OS === "android") {
                      Linking.openURL(`tel:${userData.phoneNumber}`);
                    } else {
                      Linking.openURL(`telprompt:${userData.phoneNumber}`);
                    }
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={tailwind("mt-1 text-xs underline text-blue-500")}
                  >
                    {userData.phoneNumber ?? "phone"}
                  </Text>
                </TouchableOpacity>
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

        {ongoing && (
          <View style={tailwind("flex flex-row w-full mt-4")}>
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
                      onPress: () => {
                        db.collection("appointments").doc(id).update({
                          status: "CANCELLED",
                        });
                        navigation.popToTop();
                      },
                    },
                  ]
                );
              }}
              activeOpacity={0.6}
              style={[
                tailwind(
                  "flex-1 flex-shrink-0 mr-1 py-2 px-4 rounded items-center justify-center bg-gray-300"
                ),
                { ...SHADOW_SM },
              ]}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Mark as Finished?",
                  "This appoint has been finished.",
                  [
                    {
                      text: "Cancel",
                      onPress: () => {},
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => {
                        db.collection("appointments").doc(id).update({
                          status: "FINISHED",
                        });
                        navigation.popToTop();
                      },
                    },
                  ]
                );
              }}
              activeOpacity={0.6}
              style={[
                tailwind(
                  "flex-1 flex-shrink-0 ml-1 bg-green-500 py-2 px-4 rounded items-center justify-center"
                ),
                { ...SHADOW_SM },
              ]}
            >
              <Text style={tailwind("text-white text-center")}>Finished</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ShopAppointmentItem;
