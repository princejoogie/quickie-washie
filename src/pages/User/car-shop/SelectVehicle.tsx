import { useRoute } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db } from "../../../lib/firebase";
import { CarProp, Service, ShopProps } from "../../../types/data-types";

interface SelectVehicleProps {}

const SelectVehicle: React.FC<SelectVehicleProps> = ({ navigation }: any) => {
  const route = useRoute();
  const { service, shop, appointmentDate } = route.params as {
    shop: ShopProps;
    service: Service;
    appointmentDate: string;
  };
  const [cars, setCars] = useState<CarProp[]>([]);
  const [selectedCar, setSelectedCar] = useState("");
  const [noCars, setNoCars] = useState(false);
  const { user } = useContext(DatabaseContext);

  useEffect(() => {
    const listener = db
      .collection("users")
      .doc(user?.uid)
      .collection("cars")
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length <= 0) setNoCars(true);
        else
          setCars(
            snapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as CarProp)
            )
          );
      });

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

    return listener;
  }, []);

  return noCars ? (
    <View style={tailwind("p-4")}>
      <Text style={tailwind("text-center")}>
        No cars. Register a vehicle in your Profile.
      </Text>
    </View>
  ) : (
    <View style={tailwind("flex flex-1")}>
      <View style={tailwind("absolute z-50 bottom-2 inset-x-2")}>
        <TouchableOpacity
          disabled={!selectedCar}
          onPress={() => {
            const car = cars.find((e) => e.id === selectedCar);
            navigation.navigate("AppointmentSummary", {
              service,
              shop,
              appointmentDate,
              car,
            });
          }}
          activeOpacity={0.5}
          style={tailwind(
            `flex mt-2 flex-row p-2 rounded items-center justify-center ${
              !selectedCar ? "bg-gray-300" : "bg-green-500"
            }`
          )}
        >
          <Text style={tailwind("text-white rounded")}>
            Appointment Summary
          </Text>
          <View style={tailwind("absolute right-2")}>
            <Icon name="arrow-right" type="feather" color="#ffffff" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={tailwind("p-4")}>
          {cars.map((car) => (
            <CarItem key={car.id} {...{ car, selectedCar, setSelectedCar }} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
interface ItemProp {
  car: CarProp;
  selectedCar: string;
  setSelectedCar: React.Dispatch<React.SetStateAction<string>>;
}

const CarItem: React.FC<ItemProp> = ({ car, selectedCar, setSelectedCar }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedCar(car.id);
      }}
      activeOpacity={0.7}
      style={[tailwind("flex flex-row p-2 bg-white mt-2"), { ...SHADOW_SM }]}
    >
      <View style={tailwind("items-center justify-center")}>
        {selectedCar === car.id ? (
          <Icon
            name="dot-circle-o"
            type="font-awesome"
            size={20}
            color="#6366F1"
          />
        ) : (
          <Icon name="circle-o" type="font-awesome" size={20} color="#D1D5DB" />
        )}
      </View>

      <View style={tailwind("flex-1 ml-2")}>
        <Text style={tailwind("font-bold")}>{car.plateNumber}</Text>
        <View style={tailwind("items-center flex flex-row")}>
          <Text style={tailwind("text-xs text-gray-500")}>Type: </Text>
          <Text style={tailwind("text-xs")}>{car.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SelectVehicle;
