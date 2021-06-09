import React, { createRef, useState } from "react";
import tailwind from "tailwind-rn";
import {
  TextInput,
  Text,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Input, Button } from "react-native-elements";
import { auth } from "../lib/firebase";
import { Image } from "react-native-elements/dist/image/Image";
import { WIDTH } from "../constants";
import { useNavigation } from "@react-navigation/core";
import { Icon } from "react-native-elements/dist/icons/Icon";

const Login: React.FC = () => {
  const navigation = useNavigation();
  const passRef = createRef<TextInput>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

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
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding" })}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      style={tailwind("flex flex-1 justify-center")}
    >
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
          placeholder="Email Address"
          inputStyle={tailwind("pl-2 text-sm")}
          onSubmitEditing={() => passRef.current?.focus()}
          onChangeText={setEmail}
          value={email}
          leftIcon={{ type: "feather", name: "mail", size: 18 }}
          leftIconContainerStyle={tailwind("opacity-50")}
          containerStyle={tailwind("mt-2")}
          keyboardType="email-address"
        />

        <Input
          placeholder="Password"
          inputStyle={tailwind("pl-2 text-sm")}
          onChangeText={setPassword}
          value={password}
          leftIcon={{ type: "feather", name: "key", size: 18 }}
          leftIconContainerStyle={tailwind("opacity-50")}
          ref={passRef}
          secureTextEntry={!visible}
          rightIcon={
            <Icon
              onPress={() => setVisible(!visible)}
              type="feather"
              name={`${!visible ? "eye-off" : "eye"}`}
              size={18}
            />
          }
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
            Register your Shop
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
