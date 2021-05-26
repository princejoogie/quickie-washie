import React from "react";
import { Text, View } from "react-native";
import { firebase } from "../../../lib/firebase";
import { useRoute } from "@react-navigation/core";

const ShopDetail: React.FC = () => {
  const route = useRoute();
  const { shop } = route.params as { shop: firebase.firestore.DocumentData };

  return (
    <View>
      <Text>{shop.shopName}</Text>
    </View>
  );
};

export default ShopDetail;
