import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db } from "../../../lib/firebase";
import { CarProp } from "../../../types/data-types";

interface ItemProp {
  car: CarProp;
}

const OwnedCars: React.FC = () => {
  const { user } = useContext(DatabaseContext);
  const navigation = useNavigation();
  const [cars, setCars] = useState<CarProp[]>([]);

  useEffect(() => {
    const listener = db
      .collection("users")
      .doc(user?.uid)
      .collection("cars")
      .onSnapshot((snapshot) => {
        setCars(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CarProp))
        );
      });

    return listener;
  }, []);

  return (
    <View style={tailwind("flex flex-1")}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SelectCarType", { hello: "Hello" });
        }}
        activeOpacity={0.7}
        style={tailwind(
          "p-2 rounded-full bg-blue-500 z-50 absolute bottom-4 right-4"
        )}
      >
        <Icon name="plus" type="feather" color="#FFFFFF" />
      </TouchableOpacity>
      <ScrollView style={tailwind("flex flex-1")}>
        <View style={tailwind("px-4 pt-2 pb-4")}>
          {cars.map((car) => (
            <CarItem key={car.id} car={car} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const CarItem: React.FC<ItemProp> = ({ car }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("UpdateCar", { car });
      }}
      activeOpacity={0.7}
      style={[tailwind("flex flex-row p-2 bg-white mt-2"), { ...SHADOW_SM }]}
    >
      <View style={tailwind("flex-1")}>
        <Text style={tailwind("font-bold")}>{car.plateNumber}</Text>
        <View style={tailwind("items-center flex flex-row")}>
          <Text style={tailwind("text-xs text-gray-500")}>Type: </Text>
          <Text style={tailwind("text-xs")}>{car.type}</Text>
        </View>
      </View>

      <View style={tailwind("items-center justify-center")}>
        <Icon name="chevron-right" type="feather" color="#4B5563" />
      </View>
    </TouchableOpacity>
  );
};

export default OwnedCars;
