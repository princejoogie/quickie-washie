import { useRoute } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { Spacer } from "../../../components";
import { CarList, SHADOW_SM } from "../../../constants";
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db } from "../../../lib/firebase";
import { AdditionPrice, Service } from "../../../types/data-types";

const UpdateService: React.FC = ({ navigation }: any) => {
  const route = useRoute();
  const { service } = route.params as { service: Service };
  console.log(service.additional);
  const { user } = useContext(DatabaseContext);
  const [name, setName] = useState(service.name);
  const [price, setPrice] = useState(service.price);
  const [description, setDescription] = useState(service.description);
  const [additional, setAdditional] = useState<AdditionPrice[]>(
    JSON.parse(JSON.stringify(service.additional))
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    price: false,
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

  const isValid = () => {
    const _errors = errors;
    if (!name.trim()) _errors.name = true;
    else _errors.name = false;

    if (!price.trim()) _errors.price = true;
    else _errors.price = false;

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

  const isSame = () => {
    let diff = true;

    for (let i = 0; i < additional.length; i++) {
      if (additional[i].price !== service.additional[i].price) {
        diff = false;
        break;
      }
    }

    return (
      service.name === name &&
      service.price === price &&
      service.description === description &&
      diff
    );
  };

  const handleAdditional = (text: string, i: number) => {
    const _additional = additional;
    _additional[i].price = text;
    setAdditional(() => [..._additional]);
  };

  const getAdditional = (): AdditionPrice[] => {
    return additional.map(({ price, type }) => ({
      price: !price ? "0" : price,
      type,
    }));
  };

  return (
    <KeyboardAvoidingView>
      <FlatList
        style={tailwind("p-4")}
        data={CarList}
        horizontal={false}
        removeClippedSubviews={false}
        numColumns={2}
        renderItem={({ item, index }) => (
          <View
            style={tailwind(
              `mt-2 flex-1 ${
                CarList.length % 2 !== 0 && index === CarList.length - 1
                  ? "mr-0 ml-0"
                  : index % 2 === 0
                  ? "mr-1"
                  : "ml-1"
              }`
            )}
          >
            <Text style={tailwind("text-xs text-gray-600")}>{item}</Text>
            <TextInput
              keyboardType="number-pad"
              value={additional[index]?.price}
              onChangeText={(text) => handleAdditional(text, index)}
              placeholder="0.00"
              style={[
                tailwind("bg-white p-2 mt-1 flex-1 h-10 rounded"),
                { ...SHADOW_SM },
              ]}
            />
          </View>
        )}
        keyExtractor={(car) => car}
        ListHeaderComponent={
          <View>
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
              Base Price
            </Text>
            <View
              style={tailwind("flex flex-row items-center justify-between")}
            >
              <Text>₱</Text>
              <TextInput
                keyboardType="number-pad"
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                style={[
                  tailwind("flex-1 bg-white p-2 ml-1 mt-1 h-10 rounded"),
                  { ...SHADOW_SM },
                ]}
              />
            </View>

            {errors.price && (
              <Text style={tailwind("text-xs text-red-500 mt-1")}>
                Base Price Required.
              </Text>
            )}

            <Text style={tailwind("font-bold text-black text-lg mt-4")}>
              Additional Price
            </Text>
          </View>
        }
        ListFooterComponent={
          <View>
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
              style={[
                tailwind("mt-1 bg-white p-2 h-20 rounded"),
                { ...SHADOW_SM },
              ]}
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
                      description: description.trim(),
                      price: price.trim(),
                      additional: getAdditional(),
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

            <Spacer />
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};

export default UpdateService;
