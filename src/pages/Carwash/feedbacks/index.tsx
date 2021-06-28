import React, { useState, useEffect, useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db } from "../../../lib/firebase";
import { Feedback, User } from "../../../types/data-types";
import { Avatar, Icon } from "react-native-elements";
import { Divider } from "../../../components";

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const { user } = useContext(DatabaseContext);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [average, setAverage] = useState(0);
  const [length, setLength] = useState(0);

  useEffect(() => {
    const listener = db
      .collection("feedbacks")
      .where("shopID", "==", user?.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setLoading(() => false);
        const len = snapshot.docs.length;
        if (len <= 0) setNoData(() => true);
        else {
          setNoData(() => false);
          let total = 0;
          setFeedbacks(
            snapshot.docs.map((doc) => {
              const fb = { id: doc.id, ...doc.data() } as Feedback;
              total += fb.rating;
              return fb;
            })
          );
          const avg = total / len;
          setLength(len);
          setAverage(avg);
        }
      });

    return listener;
  }, []);

  return loading ? (
    <ActivityIndicator style={tailwind("mt-4")} size="small" color="#000" />
  ) : noData ? (
    <Text style={tailwind("text-center mt-4")}>No Feedbacks</Text>
  ) : (
    <ScrollView>
      <View style={tailwind("p-4")}>
        <Text style={tailwind("text-center text-4xl font-bold")}>
          {average.toFixed(1)}
        </Text>
        <View style={tailwind("flex flex-row justify-center items-center")}>
          {renderRating(Math.floor(average))}
        </View>
        <Text style={tailwind("text-center")}>Based on {length} review(s)</Text>

        <Divider className="my-2" />

        {feedbacks.map((feedback) => (
          <Item key={feedback.id} feedback={feedback} />
        ))}
      </View>
    </ScrollView>
  );
};

interface ItemProp {
  feedback: Feedback;
}

const Item: React.FC<ItemProp> = ({ feedback }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = (
          await db.collection("users").doc(feedback.userID).get()
        ).data() as User;

        setUser(data);
        setLoading(() => false);
      } catch (err) {
        setUser(null);
        setLoading(() => false);
      }
    })();
  }, []);

  return loading ? (
    <View
      style={[
        tailwind("flex flex-row p-2 bg-white mt-2 rounded"),
        { ...SHADOW_SM },
      ]}
    >
      <ActivityIndicator size="small" color="#000" />
    </View>
  ) : !!user ? (
    <TouchableOpacity
      onPress={() => {
        setExpanded(!expanded);
      }}
      activeOpacity={0.8}
      style={[tailwind("flex p-2 bg-white mt-2 rounded"), { ...SHADOW_SM }]}
    >
      <View style={tailwind("flex flex-row")}>
        <Avatar
          rounded
          containerStyle={tailwind("bg-gray-300")}
          size="small"
          source={user.photoURL ? { uri: user.photoURL } : undefined}
          icon={{ type: "feather", name: "image" }}
        />

        <View style={tailwind("ml-2 flex-1 flex-col justify-center")}>
          <Text style={tailwind("text-sm")}>{user.fullName}</Text>
          <View style={tailwind("flex flex-row items-center")}>
            {renderRating(feedback.rating)}
            <Text style={tailwind("text-xs text-black")}>
              {feedback.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={tailwind("flex flex-row mt-1")}>
        <Text
          numberOfLines={expanded ? 999 : 3}
          style={tailwind("flex-1 text-xs text-gray-600")}
        >
          {feedback.message}
        </Text>
      </View>
    </TouchableOpacity>
  ) : null;
};

const renderRating = (
  rating: number,
  setRating?: React.Dispatch<React.SetStateAction<number>>
) => {
  let views = [];

  for (let i = 0; i < 5; i++) {
    views.push(
      <Icon
        containerStyle={tailwind("mr-1")}
        onPress={() => {
          setRating && setRating(i + 1);
        }}
        key={`rating-${i}`}
        name={i < rating ? "star" : "staro"}
        color={i < rating ? "#F59E0B" : "#000"}
        type="ant-design"
        size={12}
      />
    );
  }

  return views;
};

export default FeedbackList;
