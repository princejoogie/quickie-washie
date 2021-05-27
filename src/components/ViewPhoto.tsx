import { useRoute } from "@react-navigation/core";
import React from "react";
import { ActivityIndicator, Image, View } from "react-native";
import tailwind from "tailwind-rn";
import { HEIGHT, WIDTH } from "../constants";

const ViewPhoto: React.FC = () => {
  const route = useRoute();
  const { uri } = route.params as { uri: string };

  return (
    <View style={tailwind("flex flex-1 items-center justify-center")}>
      <View
        style={tailwind(
          "absolute inset-0 z-10 flex flex-1 items-center justify-center"
        )}
      >
        <ActivityIndicator size="large" color="#000" />
      </View>
      <Image
        source={{ uri }}
        style={[
          { width: WIDTH, height: HEIGHT, resizeMode: "contain" },
          tailwind("z-50"),
        ]}
      />
    </View>
  );
};

export default ViewPhoto;
