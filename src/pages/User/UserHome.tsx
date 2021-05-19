import React from "react";
import { Button, Linking, ScrollView } from "react-native";
import tailwind from "tailwind-rn";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <ScrollView style={tailwind("flex flex-1")}>
      <Button
        onPress={() =>
          Linking.openURL("https://waze.com/ul?ll=14.5311,121.0213&z=10")
        }
        title="APC on Waze"
      />
    </ScrollView>
  );
};

export default Home;
