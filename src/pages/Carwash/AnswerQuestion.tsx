import { useNavigation, useRoute } from "@react-navigation/core";
import React, { useContext, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../constants";
import { DatabaseContext } from "../../contexts/DatabaseContext";
import { db } from "../../lib/firebase";
import { Question } from "../../types/data-types";

const AnswerQuestion: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useContext(DatabaseContext);
  const { q } = route.params as { q: Question };
  const [answer, setAnswer] = useState(q.answer);
  const [loading, setLoading] = useState(false);

  const sendAnswer = async () => {
    if (answer && user) {
      setLoading(() => true);

      await db
        .collection("users")
        .doc(user.uid)
        .collection("questions")
        .doc(q.id)
        .update({
          answer: answer.trim(),
        });

      setLoading(() => false);

      navigation.goBack();
    }
  };

  return (
    <ScrollView style={tailwind("flex flex-1")}>
      <View style={tailwind("p-4")}>
        <Text style={tailwind("font-bold")}>Question</Text>
        <Text style={[tailwind("p-2 bg-white mt-1 rounded"), { ...SHADOW_SM }]}>
          {q.question}
        </Text>

        <View style={tailwind("flex flex-row items-center justify-between")}>
          <Text style={tailwind("mt-4 font-bold")}>Answer</Text>
          <TouchableOpacity onPress={() => setAnswer("")}>
            <Text style={tailwind("text-xs text-blue-500")}>Clear</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          multiline
          value={answer}
          onChangeText={setAnswer}
          textAlignVertical="top"
          style={[tailwind("bg-white p-2 mt-1 h-36 rounded"), { ...SHADOW_SM }]}
          placeholder="Type your response here..."
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={sendAnswer}
          style={tailwind(
            "p-2 rounded items-center justify-center bg-blue-500 mt-4"
          )}
        >
          {loading ? (
            <ActivityIndicator color="#FFFF" size="small" />
          ) : (
            <Text style={tailwind("text-white")}>Answer</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AnswerQuestion;
