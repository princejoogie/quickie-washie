import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db, timestamp } from "../../../lib/firebase";
import { Question, ShopProps, User } from "../../../types/data-types";

interface FAQProps {
  shop: ShopProps;
}

const FAQs: React.FC<FAQProps> = ({ shop }) => {
  const { data } = useContext(DatabaseContext);
  const _data = data as User;
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [qLoading, setQLoading] = useState(true);
  const [qs, setQs] = useState<Question[]>([]);

  useEffect(() => {
    const listener = db
      .collection("users")
      .doc(shop.id)
      .collection("questions")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setQLoading(() => false);
        setQs(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Question)
          )
        );
      });

    return listener;
  }, []);

  const ask = async () => {
    if (!!question && data) {
      setLoading(() => true);
      await db
        .collection("users")
        .doc(shop.id)
        .collection("questions")
        .add({
          timestamp: timestamp(),
          userID: _data.id,
          user: {
            name: _data.fullName,
            photoURL: _data.photoURL,
          },
          question: question.trim(),
          answer: "",
        });
      setLoading(() => false);
      setQuestion("");
    }
  };

  return (
    <View style={tailwind("mt-4")}>
      <Text style={tailwind("text-gray-600")}>Questions</Text>

      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <View
          style={[
            tailwind(
              "flex items-center flex-row mt-2 border-b border-gray-300 px-3 py-1"
            ),
          ]}
        >
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="Ask a Question..."
            style={tailwind("flex-1 text-black")}
          />
          <TouchableOpacity
            disabled={loading}
            onPress={ask}
            style={tailwind("ml-2")}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={tailwind("text-blue-500")}>Ask</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={tailwind("mt-1")}>
        {qLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          qs.map((q) => (
            <QuestionItem
              key={q.id}
              q={q}
              same={q.userID === _data.id}
              shopID={shop.id}
            />
          ))
        )}
      </View>
    </View>
  );
};

interface QItemProp {
  q: Question;
  same: boolean;
  shopID: string;
}

const QuestionItem: React.FC<QItemProp> = ({ q, same, shopID }) => {
  const date = q.timestamp?.toDate() as Date;

  const deleteQuestion = async () => {
    await db
      .collection("users")
      .doc(shopID)
      .collection("questions")
      .doc(q.id)
      .delete();
  };

  return (
    <View style={[tailwind("p-2 mt-2 bg-white rounded"), { ...SHADOW_SM }]}>
      <View style={tailwind("flex flex-row items-center justify-between")}>
        <Text style={tailwind("text-xs text-gray-500")}>
          {date && (
            <Text>
              {date.toLocaleDateString()} {date.getHours()}:{date.getMinutes()}
            </Text>
          )}
        </Text>

        {same && (
          <TouchableOpacity onPress={deleteQuestion}>
            <Icon name="close" type="ion" size={14} />
          </TouchableOpacity>
        )}
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
    </View>
  );
};

export default FAQs;
