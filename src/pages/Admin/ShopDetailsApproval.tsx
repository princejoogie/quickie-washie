import { useNavigation, useRoute } from "@react-navigation/core";
import React from "react";
import { View, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import { Avatar } from "react-native-elements";
import tailwind from "tailwind-rn";
import { db } from "../../lib/firebase";
import { ShopProps } from "../../types/data-types";

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

const ShopDetailsApproval: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { shop } = route.params as { shop: ShopProps };

  return (
    <ScrollView style={tailwind("flex flex-1")}>
      <View style={tailwind("p-4 w-full")}>
        <View style={tailwind("flex flex-row")}>
          <Avatar
            rounded
            containerStyle={tailwind("bg-gray-300")}
            size="xlarge"
            source={shop.photoURL ? { uri: shop.photoURL } : undefined}
            icon={{ type: "feather", name: "image" }}
          />

          <View
            style={tailwind("flex items-center justify-center ml-2 flex-1")}
          >
            <Text style={tailwind("text-lg font-bold")}>{shop.shopName}</Text>
          </View>
        </View>

        <DeetItem className="mt-2" content={shop.fullName} title="Owner Name" />
        <DeetItem content={shop.email} title="Email Address" />
        <DeetItem content={shop.phoneNumber} title="Contact Number" />
        <DeetItem content={shop.city} title="City" />

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ViewPhoto", { uri: shop.permitURL });
          }}
        >
          <Text style={tailwind("underline mt-4 text-center text-blue-500")}>
            View Business Permit
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
              Alert.alert("Confirm", "Are you sure you want to Approve shop?", [
                {
                  text: "Cancel",
                },
                {
                  text: "OK",
                  onPress: async () => {
                    navigation.goBack();
                    await db.collection("users").doc(shop.id).update({
                      approved: true,
                    });
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

export default ShopDetailsApproval;
