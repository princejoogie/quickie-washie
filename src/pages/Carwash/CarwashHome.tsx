import { useNavigation } from "@react-navigation/core";
import React, { useContext } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { Divider, ForReview } from "../../components";
import { WIDTH } from "../../constants";
import { DatabaseContext } from "../../contexts/DatabaseContext";

interface CarwashHomeProps {}

const CarwashHome: React.FC<CarwashHomeProps> = () => {
  const { data } = useContext(DatabaseContext);
  const navigation = useNavigation();

  if (!data) {
    return (
      <View style={tailwind("flex flex-1 items-center justify-center")}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (data.approved) {
    return (
      <ScrollView style={tailwind("flex flex-1")}>
        <View style={tailwind("w-full flex flex-row bg-gray-200 p-4")}>
          <Avatar
            size="large"
            containerStyle={tailwind("bg-gray-300")}
            rounded
            source={data?.photoURL ? { uri: data.photoURL } : undefined}
            icon={{ type: "feather", name: "image" }}
          />

          <View style={tailwind("ml-4 flex justify-center flex-1")}>
            <Text numberOfLines={1} style={tailwind("text-lg")}>
              {data?.fullName ?? "Full Name"}
            </Text>
            <Text numberOfLines={1} style={tailwind("text-gray-500")}>
              {data?.email ?? "email@example.com"}
            </Text>
            <Text
              numberOfLines={1}
              style={tailwind("mt-1 text-xs text-gray-500")}
            >
              {data?.phoneNumber ?? "phone"}
            </Text>
          </View>
        </View>

        <View
          style={tailwind(
            "p-4 flex w-full flex-row items-center justify-between"
          )}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("ShopReports")}
            style={tailwind("flex-1 items-center justify-center")}
          >
            <Icon name="linechart" type="ant-design" size={20} />
            <Text numberOfLines={1} style={tailwind("text-xs text-gray-600")}>
              Reports
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ShopFeedbacks")}
            style={tailwind("flex-1 items-center justify-center")}
          >
            <Icon name="chatbox-ellipses-outline" type="ionicon" size={20} />
            <Text numberOfLines={1} style={tailwind("text-xs text-gray-600")}>
              Feedbacks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ShopAppointments")}
            style={tailwind("flex-1 items-center justify-center")}
          >
            <Icon name="calendar" type="feather" size={20} />
            <Text numberOfLines={1} style={tailwind("text-xs text-gray-600")}>
              Appointments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ShopServicesWrapper")}
            style={tailwind("flex-1 items-center justify-center")}
          >
            <Icon name="tools" type="entypo" size={20} />
            <Text numberOfLines={1} style={tailwind("text-xs text-gray-600")}>
              Services
            </Text>
          </TouchableOpacity>
        </View>

        <Divider />

        <View style={tailwind("p-4")}>
          <Text style={tailwind("text-xs text-gray-600")}>Questions</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={tailwind("flex flex-1 items-center justify-center")}>
      <ForReview width={WIDTH * (7 / 10)} />
      <Text style={tailwind("mt-4 text-lg text-gray-600")}>
        Carwash Application under review
      </Text>
    </View>
  );
};
export default CarwashHome;
