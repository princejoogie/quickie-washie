import { useRoute } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
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
import { Service } from "../../../types/data-types";

const UpdateService: React.FC = ({ navigation }: any) => {
  const route = useRoute();
  const { service } = route.params as { service: Service };
  const _initRange = service.priceRange.split("-");
  const _lower = _initRange[0].substring(1);
  const _upper = _initRange[1];
  const { user } = useContext(DatabaseContext);
  const [name, setName] = useState(service.name);
  const [lower, setLower] = useState(_lower);
  const [upper, setUpper] = useState(_upper);
  const [description, setDescription] = useState(service.description);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    range: false,
    description: false,
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Confirm",
              `Are you sure you want to delete ${service.name}?`,
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
                      .collection("services")
                      .doc(service.id)
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
    return (
      service.name === name &&
      service.description === description &&
      _lower === lower &&
      _upper === upper
    );
  };

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
          disabled={loading || isSame()}
          activeOpacity={0.7}
          onPress={async () => {
            setLoading(() => true);
            if (isValid() && user) {
              await db
                .collection("users")
                .doc(user.uid)
                .collection("services")
                .doc(service.id)
                .update({
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
            `p-2 rounded items-center justify-center mt-4 ${
              isSame() ? "bg-gray-300" : "bg-blue-500"
            }`
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

export default UpdateService;
