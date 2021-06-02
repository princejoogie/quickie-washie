import { useNavigation, useRoute } from "@react-navigation/core";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-elements";
import tailwind from "tailwind-rn";
import { db } from "../../../lib/firebase";
import { User } from "../../../types/data-types";

interface DeetItemProps {
  title: string;
  content: string;
  className?: string;
}

const DeetItem: React.FC<DeetItemProps> = ({
  content,
  title,
  className = "",
}) => {
  return (
    <View style={tailwind(`flex ${className}`)}>
      <Text style={tailwind("mt-2 text-xs text-gray-600")}>{title}</Text>
      <Text style={tailwind("bg-gray-200 rounded mt-1 p-2")}>{content}</Text>
    </View>
  );
};

const UserDetails: React.FC = () => {
  const route = useRoute();
  const { user } = route.params as { user: User };
  const navigation = useNavigation();

  return (
    <ScrollView style={tailwind("flex flex-1")}>
      <View style={tailwind("p-4")}>
        <Avatar
          rounded
          containerStyle={tailwind("self-center bg-gray-300")}
          size="xlarge"
          source={user.photoURL ? { uri: user.photoURL } : undefined}
          icon={{ type: "feather", name: "image" }}
        />

        <DeetItem className="mt-2" title="Full Name" content={user.fullName} />
        <DeetItem className="mt-2" title="Email Addres" content={user.email} />
        <DeetItem
          className="mt-2"
          title="Phone Number"
          content={user.phoneNumber}
        />

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ViewPhoto", { uri: user.licenseURL });
          }}
        >
          <Text style={tailwind("underline mt-4 text-center text-blue-500")}>
            View Drivers License
          </Text>
        </TouchableOpacity>

        <View style={tailwind("flex flex-row mt-4")}>
          <TouchableOpacity
            style={tailwind(
              "flex-1 flex-shrink-0 px-4 py-2 items-center justify-center mr-1"
            )}
            onPress={() => navigation.goBack()}
          >
            <Text style={tailwind("text-xs text-red-500")}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tailwind(
              "flex-1 flex-shrink-0 bg-green-500 rounded px-4 py-2 items-center justify-center ml-1"
            )}
            onPress={() => {
              Alert.alert("Confirm", "Are you sure you want to Approve user?", [
                {
                  text: "Cancel",
                },
                {
                  text: "OK",
                  onPress: async () => {
                    await db.collection("users").doc(user.id).update({
                      approved: true,
                    });
                    navigation.goBack();
                  },
                },
              ]);
            }}
          >
            <Text style={tailwind("text-white text-xs")}>Approve</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserDetails;
