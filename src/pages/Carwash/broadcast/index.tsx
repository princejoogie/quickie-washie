import { useNavigation } from "@react-navigation/core";
import React, { useContext, useState } from "react";
import {
  TextInput,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import tw from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db, timestamp } from "../../../lib/firebase";
import { User } from "../../../types/data-types";

const index: React.FC = () => {
  const navigation = useNavigation();
  const { data } = useContext(DatabaseContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const isEmpty = !title || !content;

  const broadcast = async () => {
    if (data) {
      try {
        setLoading(() => true);

        const snapshot = await db
          .collection("users")
          .where("privilege", "==", "ADMIN")
          .get();

        const users = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as User)
        );

        users.forEach(async ({ id }) => {
          await db
            .collection("users")
            .doc(id)
            .collection("notifications")
            .add({
              title: title.trim(),
              content: content.trim(),
              timestamp: timestamp(),
              opened: false,
              photoURL: data.photoURL ? data.photoURL : "",
              shopName: data.shopName,
            });
        });

        setLoading(() => false);
        navigation.goBack();
      } catch (error) {
        Alert.alert("Something went wrong.");
      }
    }
  };

  return (
    <View style={tw("p-4 flex flex-1")}>
      <Text style={tw("font-bold")}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={[tw("mt-1 bg-white p-2 rounded"), { ...SHADOW_SM }]}
      />

      <Text style={tw("font-bold mt-4")}>Content</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        numberOfLines={5}
        style={[tw("mt-1 h-20 bg-white p-2 rounded"), { ...SHADOW_SM }]}
      />

      <TouchableOpacity
        disabled={loading || isEmpty}
        onPress={broadcast}
        activeOpacity={0.6}
        style={[
          tw(
            `mt-4 flex items-center justify-center px-4 py-2 rounded ${
              loading || isEmpty
                ? "bg-gray-300 opacity-50"
                : "bg-blue-500 opacity-100"
            }`
          ),
          { ...SHADOW_SM },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={tw("text-white")}>Broadcast</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default index;
