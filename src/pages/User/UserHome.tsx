import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  Button,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import tailwind from "tailwind-rn";
import { db } from "../../lib/firebase";

interface HomeProps {}

type Tag = {
  rando?: string;
  tag?: string;
  url: string;
};

const TagItem: React.FC<{ tag: Tag }> = ({ tag }) => {
  return (
    <TouchableOpacity
      onPress={async () => {
        const can = await Linking.canOpenURL(tag.url);
        if (can) Linking.openURL(tag.url);
        else alert("Cannot Open URL.");
      }}
      style={tailwind(
        "px-4 py-2 mt-2 mx-2 rounded bg-gray-100 border border-gray-400"
      )}
    >
      {tag.rando && <Text style={tailwind("font-bold")}>{tag.rando}</Text>}

      {tag.tag && <Text style={tailwind("font-bold")}>{tag.tag}</Text>}

      <Text numberOfLines={3} style={tailwind("mt-2 text-xs text-gray-500")}>
        {tag.url}
      </Text>
    </TouchableOpacity>
  );
};

const Home: React.FC<HomeProps> = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const nav = useNavigation();

  useEffect(() => {
    const subscriber = db.collection("tags").onSnapshot((snapshot) => {
      setTags(
        snapshot.docs.map((doc) => {
          const d = doc.data() as Tag;
          return d;
        })
      );
    });

    return subscriber;
  }, []);

  return (
    <ScrollView style={tailwind("flex flex-1")}>
      <Button
        onPress={() =>
          Linking.openURL("https://waze.com/ul?ll=14.5311,121.0213&z=10")
        }
        title="APC on Waze"
      />
      <Button title="TestRN" onPress={() => nav.navigate("TestRN")} />
      {/* {tags.map((tag, i) => (
        <TagItem tag={tag} key={`${tag.rando ?? tag.tag}-${i}`} />
      ))} */}
    </ScrollView>
  );
};

export default Home;
