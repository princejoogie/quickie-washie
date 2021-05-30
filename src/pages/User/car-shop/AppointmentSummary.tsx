import { useRoute } from "@react-navigation/core";
import React, { useEffect } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { formatAppointmentDate } from "../../../lib/helpers";
import { CarProp, Service, ShopProps } from "../../../types/data-types";

interface AppointmentSummaryProps {}

const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({
  navigation,
}: any) => {
  const route = useRoute();
  const { service, shop, appointmentDate, car } = route.params as {
    shop: ShopProps;
    service: Service;
    appointmentDate: string;
    car: CarProp;
  };
  const date = new Date(appointmentDate);

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
          onPress={() => {}}
          activeOpacity={0.5}
          style={tailwind(
            "flex mt-2 bg-green-500 flex-row p-2 rounded items-center justify-center"
          )}
        >
          <Text style={tailwind("text-white rounded")}>
            Confirm Appointment
          </Text>
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
              tailwind("bg-white rounded p-2 mt-1 flex-row"),
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

            <View style={tailwind("ml-2")}>
              <Text>{shop.shopName}</Text>
            </View>
          </View>

          <Text style={tailwind("mt-3 text-xs text-gray-600")}>
            Service Type
          </Text>
          <View
            style={[
              tailwind("bg-white rounded p-2 mt-1 flex-row"),
              { ...SHADOW_SM },
            ]}
          >
            <Text>{service.name}</Text>
          </View>

          <Text style={tailwind("mt-3 text-xs text-gray-600")}>
            Appointment Date
          </Text>
          <View
            style={[
              tailwind("bg-white rounded p-2 mt-1 flex-row"),
              { ...SHADOW_SM },
            ]}
          >
            <Text>{formatAppointmentDate(date, date)}</Text>
          </View>

          <Text style={tailwind("mt-3 text-xs text-gray-600")}>
            Selected Vehicle
          </Text>
          <View
            style={[
              tailwind("bg-white rounded p-2 mt-1 flex-row"),
              { ...SHADOW_SM },
            ]}
          >
            <View style={tailwind("flex-1")}>
              <Text style={tailwind("font-bold")}>{car.plateNumber}</Text>
              <View style={tailwind("items-center flex flex-row")}>
                <Text style={tailwind("text-xs text-gray-500")}>Type: </Text>
                <Text style={tailwind("text-xs")}>{car.type}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AppointmentSummary;
