import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../constants";
import { DatabaseContext } from "../../contexts/DatabaseContext";
import { db } from "../../lib/firebase";
import { Question } from "../../types/data-types";

interface QItemProp {
  q: Question;
  shopID: string | undefined;
}

const QuestionList: React.FC = () => {
  const { user } = useContext(DatabaseContext);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const listener = db
      .collection("users")
      .doc(user?.uid)
      .collection("questions")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setLoading(() => false);
        if (snapshot.docs.length <= 0) setNoData(() => true);
        else {
          setNoData(() => false);
          setQuestions(
            snapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Question)
            )
          );
        }
      });

    return listener;
  }, []);

  return (
    <View style={tailwind("p-4")}>
      <Text style={tailwind("text-xs text-gray-600")}>Questions</Text>

      {loading ? (
        <ActivityIndicator style={tailwind("mt-2")} size="small" color="#000" />
      ) : noData ? (
        <Text style={tailwind("mt-2 text-center")}>No Questions.</Text>
      ) : (
        <View>
          {questions.map((q) => (
            <QuestionItem key={q.id} q={q} shopID={user?.uid} />
          ))}
        </View>
      )}
    </View>
  );
};

const QuestionItem: React.FC<QItemProp> = ({ q, shopID }) => {
  const date = q.timestamp?.toDate() as Date;
  const navigation = useNavigation();

  const deleteQuestion = async () => {
    if (shopID) {
      await db
        .collection("users")
        .doc(shopID)
        .collection("questions")
        .doc(q.id)
        .delete();
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("AnswerQuestion", { q });
      }}
      activeOpacity={0.7}
      style={[tailwind("p-2 mt-2 bg-white rounded"), { ...SHADOW_SM }]}
    >
      <View style={tailwind("flex flex-row items-center justify-between")}>
        <Text style={tailwind("text-xs text-gray-500")}>
          {date && (
            <Text>
              {date.toLocaleDateString()} {date.getHours()}:{date.getMinutes()}
            </Text>
          )}
        </Text>

        <TouchableOpacity onPress={deleteQuestion}>
          <Icon name="close" type="ion" size={14} />
        </TouchableOpacity>
      </View>

      <View style={tailwind("mt-2 flex flex-row")}>
        <Avatar
          size="small"
          containerStyle={tailwind("bg-gray-300")}
          rounded
          source={q.user.photoURL ? { uri: q.user.photoURL } : undefined}
          icon={{ type: "feather", name: "image" }}
        />

        <Text style={tailwind("flex-1 ml-2")}>{q.question}</Text>
      </View>

      {!!q.answer && (
        <View>
          <Text style={tailwind("mt-2 text-gray-600 text-xs")}>Response: </Text>
          <Text style={tailwind("ml-4 flex")}>{q.answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default QuestionList;
