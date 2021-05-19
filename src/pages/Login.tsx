import React, { createRef, useState } from "react";
import tailwind from "tailwind-rn";
import {
  TextInput,
  Text,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
} from "react-native";
import { Input, Button } from "react-native-elements";
import { auth } from "../lib/firebase";
import { Image } from "react-native-elements/dist/image/Image";
import { WIDTH } from "../constants";
import { useNavigation } from "@react-navigation/core";

const Login: React.FC = () => {
  const navigation = useNavigation();
  const passRef = createRef<TextInput>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    auth
      .signInWithEmailAndPassword(email.trim(), password.trim())
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };

  return (
    <KeyboardAvoidingView style={tailwind("flex flex-1 justify-center")}>
      <View style={tailwind("w-full flex items-center justify-center")}>
        <Image
          source={require("../assets/logo.png")}
          style={{
            width: (WIDTH * 2) / 3,
            height: (WIDTH * 2) / 3,
            resizeMode: "contain",
          }}
        />
      </View>

      <View style={tailwind("p-4")}>
        {error && (
          <Text style={tailwind("text-center text-red-500")}>{error}</Text>
        )}

        <Input
          containerStyle={tailwind("mt-2")}
          keyboardType="email-address"
          placeholder="Email Address"
          onSubmitEditing={() => passRef.current?.focus()}
          onChangeText={setEmail}
        />

        <Input
          ref={passRef}
          placeholder="Password"
          onSubmitEditing={async () => await login()}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title="Log In"
          onPress={async () => await login()}
          loading={loading}
        />

        <View style={tailwind("mt-2")} />

        <Button
          title="Sign Up"
          onPress={() => navigation.navigate("Signup")}
          type="outline"
        />

        <Text style={tailwind("self-center my-2")}>or</Text>

        <TouchableOpacity
          style={tailwind("self-center")}
          onPress={() => navigation.navigate("CarwashSignup")}
        >
          <Text style={tailwind("text-gray-500 underline")}>
            Register your Carwash
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
