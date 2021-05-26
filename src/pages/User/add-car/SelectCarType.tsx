import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
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
import { CarType } from "../../../types/data-types";

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

const SelectCarType: React.FC = ({ navigation }: any) => {
  const { user } = useContext(DatabaseContext);
  const [type, setType] = useState<CarType>("Hatchback / Sedan");
  const [plateNo, setPlatNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

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
            disabled={loading}
            activeOpacity={0.7}
            onPress={async () => {
              if (plateNo) {
                setHasError(() => false);
                setLoading(() => true);
                await db
                  .collection("users")
                  .doc(user?.uid)
                  .collection("cars")
                  .add({
                    type,
                    plateNumber: plateNo,
                  });
                setLoading(() => false);
                navigation.popToTop();
              } else {
                Vibration.vibrate();
                console.log("No Plate Number");
                setLoading(() => false);
                setHasError(() => true);
              }
            }}
            style={tailwind(
              "p-2 rounded items-center justify-center bg-blue-500 mt-4"
            )}
          >
            {loading ? (
              <ActivityIndicator color="#FFFF" size="small" />
            ) : (
              <Text style={tailwind("text-white")}>Confirm</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default SelectCarType;
