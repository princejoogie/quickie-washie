import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db } from "../../../lib/firebase";

const AddService: React.FC = ({ navigation }: any) => {
  const { user } = useContext(DatabaseContext);
  const [name, setName] = useState("");
  const [lower, setLower] = useState("");
  const [upper, setUpper] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <View style={tailwind("flex flex-1")}>
      <KeyboardAvoidingView style={tailwind("p-4")}>
        <Text style={tailwind("font-bold text-black text-lg")}>
          Name of Service
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Paint Detailing"
          style={[tailwind("bg-white p-2 h-10 rounded"), { ...SHADOW_SM }]}
        />
        {hasError && (
          <Text style={tailwind("text-xs text-red-500 mt-1")}>
            Plate Number Required.
          </Text>
        )}

        <Text style={tailwind("font-bold text-black text-lg mt-4")}>
          Price Range
        </Text>
        <View style={tailwind("flex flex-row items-center justify-between")}>
          <View style={tailwind("mr-2 flex-1")}>
            <Text style={tailwind("text-center")}>Lower</Text>
            <View style={tailwind("flex flex-row items-center")}>
              <Text>₱</Text>
              <TextInput
                keyboardType="number-pad"
                value={lower}
                onChangeText={setLower}
                placeholder="0"
                style={[
                  tailwind("flex-1 bg-white p-2 ml-1 mt-1 h-10 rounded"),
                  { ...SHADOW_SM },
                ]}
              />
            </View>
          </View>

          <View style={tailwind("ml-2 flex-1")}>
            <Text style={tailwind("text-center")}>Upper</Text>
            <View style={tailwind("flex flex-row items-center")}>
              <Text>₱</Text>
              <TextInput
                keyboardType="number-pad"
                value={upper}
                onChangeText={setUpper}
                placeholder="0"
                style={[
                  tailwind("flex-1 bg-white p-2 ml-1 mt-1 h-10 rounded"),
                  { ...SHADOW_SM },
                ]}
              />
            </View>
          </View>
        </View>
        {hasError && (
          <Text style={tailwind("text-xs text-red-500 mt-1")}>
            Plate Number Required.
          </Text>
        )}

        <Text style={tailwind("font-bold text-black text-lg mt-4")}>
          Description
        </Text>
        <TextInput
          multiline
          numberOfLines={5}
          value={name}
          onChangeText={setName}
          placeholder="Paint Detailing"
          textAlignVertical="top"
          style={[tailwind("mt-1 bg-white p-2 rounded"), { ...SHADOW_SM }]}
        />

        <TouchableOpacity
          disabled={loading}
          activeOpacity={0.7}
          onPress={async () => {
            // if (plateNo) {
            //   setHasError(() => false);
            //   setLoading(() => true);
            //   await db
            //     .collection("users")
            //     .doc(user?.uid)
            //     .collection("cars")
            //     .add({
            //       type,
            //       plateNumber: plateNo,
            //     });
            //   setLoading(() => false);
            //   navigation.popToTop();
            // } else {
            //   Vibration.vibrate();
            //   setLoading(() => false);
            //   setHasError(() => true);
            // }
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
    </View>
  );
};

export default AddService;
