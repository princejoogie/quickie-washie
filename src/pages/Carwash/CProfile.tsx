import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useRoute } from "@react-navigation/core";
import tailwind from "tailwind-rn";
import { Avatar } from "react-native-elements";
import { User } from "../../types/data-types";

const CProfile: React.FC = () => {
  const route = useRoute();
  const { data } = route.params as { data: User };
  const [fullName, setFullName] = useState(data.fullName);
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber);
  const [image, setImage] = useState<string | undefined>("");

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
          source={
            image || data.photoURL
              ? { uri: image ? image : data.photoURL }
              : undefined
          }
          icon={{ type: "feather", name: "image" }}
        >
          <Avatar.Accessory size={30} onPress={pickImage} />
        </Avatar>
      </View>
    </ScrollView>
  );
};

export default CProfile;
