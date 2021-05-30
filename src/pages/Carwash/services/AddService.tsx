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
  const [errors, setErrors] = useState({
    name: false,
    range: false,
    description: false,
  });

  const isValid = () => {
    const _errors = errors;
    if (!name.trim()) _errors.name = true;
    else _errors.name = false;

    if (!lower.trim() || !upper.trim()) _errors.range = true;
    else _errors.range = false;

    if (!description.trim()) _errors.description = true;
    else _errors.description = false;

    setErrors(() => ({ ..._errors }));

    let _count = 0;
    Object.keys(_errors).forEach((key) => {
      // @ts-ignore
      if (_errors[key]) _count++;
    });

    setErrors(() => ({ ..._errors }));
    return _count === 0;
  };

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
        {errors.name && (
          <Text style={tailwind("text-xs text-red-500 mt-1")}>
            Service Name Required.
          </Text>
        )}

        <Text style={tailwind("font-bold text-black text-lg mt-4")}>
          Price Range
        </Text>
        <View style={tailwind("flex flex-row items-center justify-between")}>
          <View style={tailwind("mr-1 flex-1")}>
            <Text style={tailwind("text-center")}>Lower</Text>
            <View style={tailwind("flex flex-row items-center")}>
              <Text>₱</Text>
              <TextInput
                keyboardType="number-pad"
                value={lower}
                onChangeText={setLower}
                placeholder="0.00"
                style={[
                  tailwind("flex-1 bg-white p-2 ml-1 mt-1 h-10 rounded"),
                  { ...SHADOW_SM },
                ]}
              />
            </View>
          </View>

          <View style={tailwind("self-end items-center justify-center h-10")}>
            <Text style={tailwind("text-center")}>to</Text>
          </View>

          <View style={tailwind("flex-1")}>
            <Text style={tailwind("text-center")}>Upper</Text>
            <View style={tailwind("flex flex-row items-center")}>
              <TextInput
                keyboardType="number-pad"
                value={upper}
                onChangeText={setUpper}
                placeholder="0.00"
                style={[
                  tailwind("flex-1 bg-white p-2 ml-1 mt-1 h-10 rounded"),
                  { ...SHADOW_SM },
                ]}
              />
            </View>
          </View>
        </View>
        {errors.range && (
          <Text style={tailwind("text-xs text-red-500 mt-1")}>
            Price Range Required.
          </Text>
        )}

        <Text style={tailwind("font-bold text-black text-lg mt-4")}>
          Description
        </Text>
        <TextInput
          multiline
          numberOfLines={5}
          value={description}
          onChangeText={setDescription}
          placeholder="Paint Detailing"
          textAlignVertical="top"
          style={[tailwind("mt-1 bg-white p-2 h-20 rounded"), { ...SHADOW_SM }]}
        />
        {errors.description && (
          <Text style={tailwind("text-xs text-red-500 mt-1")}>
            Description Required.
          </Text>
        )}

        <TouchableOpacity
          disabled={loading}
          activeOpacity={0.7}
          onPress={async () => {
            setLoading(() => true);
            if (isValid() && user) {
              await db
                .collection("users")
                .doc(user.uid)
                .collection("services")
                .add({
                  name: name.trim(),
                  priceRange: `₱${lower.trim()}-${upper.trim()}`,
                  description: description.trim(),
                });
              setLoading(() => false);
              navigation.popToTop();
            } else {
              Vibration.vibrate();
              setLoading(() => false);
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
    </View>
  );
};

export default AddService;
