import { useRoute } from "@react-navigation/native";
import React from "react";
import { Text, View, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { Feedback, User } from "../../../types/data-types";

const renderRating = (rating: number) => {
  let views = [];

  for (let i = 0; i < 5; i++) {
    views.push(
      <Icon
        containerStyle={tailwind("mx-1")}
        key={`rating-${i}`}
        name={i < rating ? "star" : "staro"}
        color={i < rating ? "#F59E0B" : "#000"}
        type="ant-design"
        size={30}
      />
    );
  }

  return views;
};

const FeedbackItem: React.FC = () => {
  const route = useRoute();
  const { feedback, user } = route.params as { feedback: Feedback; user: User };

  return (
    <ScrollView>
      <View style={tailwind("p-4 flex flex-col")}>
        <View style={tailwind("flex flex-row items-center justify-center")}>
          {renderRating(feedback.rating)}
        </View>

        <Text>{feedback.message}</Text>
        <Text>{feedback.service.name}</Text>
        <Text>{user.fullName}</Text>
      </View>
    </ScrollView>
  );
};

export default FeedbackItem;
