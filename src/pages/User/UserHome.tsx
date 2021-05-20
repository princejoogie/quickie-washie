import React, { useContext } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { Avatar, Button } from "react-native-elements";
import tailwind from "tailwind-rn";
import { DatabaseContext } from "../../contexts/DatabaseContext";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { data } = useContext(DatabaseContext);

  return (
    <ScrollView style={tailwind("flex flex-1")}>
      <View style={tailwind("m-4")}>
        <View style={tailwind("w-full items-center justify-center")}>
          <Avatar
            size="xlarge"
            containerStyle={tailwind("bg-gray-300")}
            rounded
            source={data?.photoURL ? { uri: data.photoURL } : undefined}
            icon={{ type: "feather", name: "image" }}
          />
        </View>

        <View style={tailwind("flex flex-row items-center justify-between")}>
          <View style={tailwind("flex-1")}>
            <Text style={tailwind("mt-2 text-gray-500 text-xs self-center")}>
              Full Name
            </Text>
            <Text style={tailwind("self-center")}>{data?.fullName}</Text>
          </View>

          <View style={tailwind("flex-1")}>
            <Text style={tailwind("mt-2 text-gray-500 text-xs self-center")}>
              Email Address
            </Text>
            <Text style={tailwind("self-center")}>{data?.email}</Text>
          </View>
        </View>

        <View style={tailwind("flex flex-row items-center justify-between")}>
          <View style={tailwind("flex-1")}>
            <Text style={tailwind("mt-2 text-gray-500 text-xs self-center")}>
              Phone Number
            </Text>
            <Text style={tailwind("self-center")}>{data?.phoneNumber}</Text>
          </View>

          <View style={tailwind("flex-1")}>
            <Text style={tailwind("mt-2 text-gray-500 text-xs self-center")}>
              Privilege
            </Text>
            <Text style={tailwind("self-center")}>{data?.privilege}</Text>
          </View>
        </View>

        <Button
          containerStyle={tailwind("mt-4")}
          onPress={() =>
            Linking.openURL("https://waze.com/ul?ll=14.5311,121.0213&z=10")
          }
          title="APC on Waze"
        />
      </View>
    </ScrollView>
  );
};

export default Home;
