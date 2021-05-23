import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { AdminContext } from "../../contexts/Admin/AdminContext";
import { firebase } from "../../lib/firebase";
import { SHADOW_SM } from "../../constants";
import { useNavigation } from "@react-navigation/core";

interface Item {
  shop: firebase.firestore.DocumentData;
}

const CarwashItem: React.FC<Item> = ({ shop }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ShopDetailsApproval");
      }}
      activeOpacity={0.7}
      style={[
        tailwind("bg-white rounded-md p-3 flex flex-row mt-2"),
        { ...SHADOW_SM },
      ]}
    >
      <View style={tailwind("flex-1")}>
        <View>
          <Text style={tailwind("font-bold text-lg")}>{shop.shopName}</Text>
        </View>

        <View style={tailwind("flex w-full flex-row mt-2")}>
          <Avatar
            rounded
            size="medium"
            source={{ uri: shop.photoURL }}
            icon={{ type: "feather", name: "image" }}
          />

          <View style={tailwind("ml-2 flex justify-center")}>
            <Text style={tailwind("text-xs text-gray-600")}>
              {shop.fullName}
            </Text>
            <Text style={tailwind("text-xs text-gray-600")}>
              {shop.phoneNumber}
            </Text>
            <Text style={tailwind("text-xs text-gray-600")}>{shop.city}</Text>
          </View>
        </View>
      </View>

      <View style={tailwind("flex items-end justify-between")}>
        <Icon name="chevron-right" type="feather" color="#4B5563" />
        <View style={tailwind("px-2 py-1 bg-red-300 rounded-full")}>
          <Text style={tailwind("text-xs text-white")}>Pending</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PendingCarwashList: React.FC = () => {
  const { pendingShops } = useContext(AdminContext);

  return (
    <View style={tailwind("p-4")}>
      <Text style={tailwind("text-xs text-gray-600")}>
        Pending Carwash Shop Approval
      </Text>

      {pendingShops.map((shop) => (
        <CarwashItem key={shop.id} shop={shop} />
      ))}
    </View>
  );
};

export default PendingCarwashList;
