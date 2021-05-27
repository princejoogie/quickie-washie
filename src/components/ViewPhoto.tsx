import { useRoute } from "@react-navigation/core";
import React from "react";
import { ActivityIndicator, Image, View } from "react-native";
import tailwind from "tailwind-rn";

const ViewPhoto: React.FC = () => {
  const route = useRoute();
  const { uri } = route.params as { uri: string };

  return (
    <View style={tailwind("flex flex-1 items-center justify-center")}>
      <Image
        source={{ uri }}
        style={[{ resizeMode: "contain" }, tailwind("z-10 w-full h-full")]}
      />
      <View
        style={tailwind(
          "absolute inset-0 z-0 flex flex-1 items-center justify-center"
        )}
      >
        <ActivityIndicator size="large" color="#000" />
      </View>
    </View>
  );
};

export default ViewPhoto;
