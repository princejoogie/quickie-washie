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
import { TextInput } from "react-native-gesture-handler";
import tailwind from "tailwind-rn";
import { Divider, Spacer } from "../../../components";
import { SHADOW_SM } from "../../../constants";
import { db } from "../../../lib/firebase";
import {
  formatAppointmentDate,
  getAdditional,
  getTotalPrice,
} from "../../../lib/helpers";
import { Appointment, ShopProps } from "../../../types/data-types";

const HistoryItem: React.FC = ({ navigation }: any) => {
  const route = useRoute();
  const {
    appointment: { service, appointmentDate, shopID, vehicle: car, id, status },
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
              "Delete Item?",
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
                    await db.collection("appointments").doc(id).delete();
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
                status === "CANCELLED" ? "text-red-500" : "text-green-500"
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

        <Divider className="px-0 my-4" />

        {status === "FINISHED" && <Feedback id={id} />}

        <Spacer />
      </View>
    </ScrollView>
  );
};

interface FeedbackProps {
  id: string;
}

const renderRating = (
  rating: number,
  setRating?: React.Dispatch<React.SetStateAction<number>>
) => {
  let views = [];

  for (let i = 0; i < 5; i++) {
    views.push(
      <Icon
        containerStyle={tailwind("mx-1")}
        onPress={() => {
          setRating && setRating(i + 1);
        }}
        key={`rating-${i}`}
        name={i < rating ? "star" : "staro"}
        color={i < rating ? "#F59E0B" : "#000"}
        type="ant-design"
        size={30}
      />
    );
  }

  return views;
};

const Feedback: React.FC<FeedbackProps> = ({ id }) => {
  const [rating, setRating] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(() => true);
    await db
      .collection("appointments")
      .doc(id)
      .set(
        {
          feedback: {
            rating,
            message: message.trim(),
          },
        },
        { merge: true }
      );
    setLoading(() => false);
  };

  return (
    <View>
      <Text style={tailwind("text-base text-black font-bold text-center")}>
        How was our service?
      </Text>

      <View style={tailwind("mt-2 flex flex-row items-center justify-center")}>
        {renderRating(rating, setRating)}
      </View>

      <Text style={tailwind("mt-4 text-base text-black font-bold text-center")}>
        Leave us a message
      </Text>
      <TextInput
        multiline
        value={message}
        onChangeText={setMessage}
        numberOfLines={5}
        textAlignVertical="top"
        placeholder="Feedback message here..."
        style={[tailwind("rounded mt-2 h-20 bg-white p-2"), { ...SHADOW_SM }]}
      />

      <TouchableOpacity
        activeOpacity={0.5}
        disabled={loading || !message}
        onPress={submit}
        style={tailwind(
          `flex items-center mt-4 justify-center px-4 py-2 rounded ${
            loading || !message ? "bg-gray-300" : "bg-blue-500"
          }`
        )}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={tailwind("text-white")}>Submit Feedback</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default HistoryItem;
