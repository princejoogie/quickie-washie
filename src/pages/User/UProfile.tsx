import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useRoute } from "@react-navigation/core";
import { firebase } from "../../lib/firebase";
import tailwind from "tailwind-rn";
import { Avatar } from "react-native-elements";

const UProfile: React.FC = () => {
  const route = useRoute();
  const { data } = route.params as { data: firebase.firestore.DocumentData };
  const [image] = useState<string | undefined>("");

  const pickImage = () => {
    console.log("Hello World");
  };

  return (
    <ScrollView style={tailwind("flex flex-1")}>
      <View style={tailwind("m-4")}>
        <Avatar
          size="xlarge"
          containerStyle={tailwind("bg-gray-300")}
          rounded
          source={{ uri: image ? image : data.photoURL }}
          icon={{ type: "feather", name: "image" }}
        >
          <Avatar.Accessory size={30} onPress={pickImage} />
        </Avatar>
      </View>
    </ScrollView>
  );
};

export default UProfile;
