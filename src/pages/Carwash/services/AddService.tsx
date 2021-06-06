import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import tailwind from "tailwind-rn";
import { Spacer } from "../../../components";
import { CarList, SHADOW_SM } from "../../../constants";
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db } from "../../../lib/firebase";
import { AdditionPrice } from "../../../types/data-types";

const AddService: React.FC = ({ navigation }: any) => {
  const { user } = useContext(DatabaseContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    price: false,
    description: false,
  });
  const [additional, setAdditional] = useState<AdditionPrice[]>(
    CarList.map((car) => ({ price: "", type: car }))
  );

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

  const handleAdditional = (text: string, i: number) => {
    let _additional = additional;
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
              value={additional[index].price}
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
                "p-2 rounded items-center justify-center bg-blue-500 mt-4"
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

export default AddService;
