import { useRoute } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db } from "../../../lib/firebase";
import { CarProp, CarType } from "../../../types/data-types";

interface CarItemProps {
  type: CarType;
  setType: React.Dispatch<React.SetStateAction<CarType>>;
  checked: boolean;
}

const CarItem: React.FC<CarItemProps> = ({ type, setType, checked }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setType(type)}
      style={[
        tailwind(
          "p-2 bg-white rounded flex flex-row mt-2 items-center justify-start"
        ),
        { ...SHADOW_SM },
      ]}
    >
      {checked ? (
        <Icon
          name="dot-circle-o"
          type="font-awesome"
          size={20}
          color="#6366F1"
        />
      ) : (
        <Icon name="circle-o" type="font-awesome" size={20} color="#D1D5DB" />
      )}
      <Text style={tailwind("ml-2 text-gray-700")}>{type}</Text>
    </TouchableOpacity>
  );
};

const UpdateCar: React.FC = ({ navigation }: any) => {
  const route = useRoute();
  const { car } = route.params as { car: CarProp };
  const { user } = useContext(DatabaseContext);
  const initType = car.type;
  const initPlate = car.plateNumber;
  const [type, setType] = useState<CarType>(car.type);
  const [plateNo, setPlatNo] = useState(car.plateNumber);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Confirm",
              `Are you sure you want to delete ${car.plateNumber}?`,
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: async () => {
                    setLoading(() => true);
                    await db
                      .collection("users")
                      .doc(user?.uid)
                      .collection("cars")
                      .doc(car.id)
                      .delete();
                    setLoading(() => false);
                    navigation.popToTop();
                  },
                },
              ]
            );
          }}
        >
          <Icon name="delete-outline" />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: tailwind("mr-2"),
    });
  }, []);

  const isSame = () => {
    return initType === type && initPlate === plateNo;
  };

  return (
    <View style={tailwind("flex flex-1")}>
      <ScrollView style={tailwind("flex flex-1")}>
        <KeyboardAvoidingView style={tailwind("p-4")}>
          <Text style={tailwind("font-bold text-lg")}>Select Car Type</Text>
          <CarItem
            {...{
              type: "Bus / Truck",
              setType,
              checked: type === "Bus / Truck",
            }}
          />
          <CarItem
            {...{
              type: "Hatchback / Sedan",
              setType,
              checked: type === "Hatchback / Sedan",
            }}
          />
          <CarItem
            {...{
              type: "Jeep / SUV",
              setType,
              checked: type === "Jeep / SUV",
            }}
          />
          <CarItem
            {...{
              type: "Motorcycle / Scooter",
              setType,
              checked: type === "Motorcycle / Scooter",
            }}
          />

          <Text style={tailwind("font-bold text-lg mt-4")}>Plate Number</Text>
          <TextInput
            value={plateNo}
            onChangeText={(text) => {
              setHasError(() => false);
              setPlatNo(text.toUpperCase());
            }}
            placeholder="AAA-1111"
            style={[tailwind("bg-white p-2 h-8 uppercase"), { ...SHADOW_SM }]}
          />
          {hasError && (
            <Text style={tailwind("text-xs text-red-500 mt-1")}>
              Plate Number Required.
            </Text>
          )}

          <TouchableOpacity
            disabled={isSame()}
            activeOpacity={0.7}
            onPress={async () => {
              if (plateNo && !isSame()) {
                setHasError(() => false);
                setLoading(() => true);
                await db
                  .collection("users")
                  .doc(user?.uid)
                  .collection("cars")
                  .doc(car.id)
                  .update({ type, plateNumber: plateNo });
                setLoading(() => false);
                navigation.popToTop();
              } else {
                Vibration.vibrate();
                setLoading(() => false);
                setHasError(() => true);
              }
            }}
            style={tailwind(
              `p-2 rounded items-center justify-center mt-4 ${
                isSame() ? "bg-gray-300" : "bg-blue-500"
              }`
            )}
          >
            {loading ? (
              <ActivityIndicator color="#FFFF" size="small" />
            ) : (
              <Text style={tailwind("text-white")}>Update</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default UpdateCar;
