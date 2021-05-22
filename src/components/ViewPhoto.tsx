import { useRoute } from "@react-navigation/core";
import React from "react";
import { Image, View } from "react-native";
import tailwind from "tailwind-rn";
import { HEIGHT, WIDTH } from "../constants";

const ViewPhoto: React.FC = () => {
  const route = useRoute();
  const { uri } = route.params as { uri: string };

  return (
    <View style={tailwind("flex flex-1 items-center justify-center")}>
      <Image
        source={{ uri }}
        style={{ width: WIDTH, height: HEIGHT, resizeMode: "contain" }}
      />
    </View>
  );
};

export default ViewPhoto;
