import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import tailwind from "tailwind-rn";
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db } from "../../../lib/firebase";
import { Feedback } from "../../../types/data-types";

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const { user } = useContext(DatabaseContext);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const listener = db
      .collection("feedbacks")
      .where("shopID", "==", user?.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setLoading(() => false);
        if (snapshot.docs.length <= 0) setNoData(() => true);
        else {
          setNoData(() => false);
          setFeedbacks(
            snapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Feedback)
            )
          );
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
        <Text>Feedbacks Hello WOrld</Text>
      </View>
    </ScrollView>
  );
};

export default FeedbackList;
