import React, { createRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { Input, Avatar, Button } from "react-native-elements";
import { Icon } from "react-native-elements/dist/icons/Icon";
import tailwind from "tailwind-rn";
import { auth, db, storage, firebase } from "../lib/firebase";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useNavigation } from "@react-navigation/core";

interface PickImageProps {
  aspect?: [number, number] | undefined;
  resize?: boolean;
  allowsEditing?: boolean;
  setPhoto: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Signup: React.FC = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("+63");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const emailRef = createRef<TextInput>();
  const numberRef = createRef<TextInput>();
  const passwordRef = createRef<TextInput>();
  const confirmRef = createRef<TextInput>();
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    number: false,
    password: false,
    confirm: false,
    license: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | undefined>("");
  const [license, setLicense] = useState<string | undefined>("");

  const isValid = () => {
    const _errors = errors;
    if (!name.trim()) _errors.name = true;
    else _errors.name = false;

    if (!email.trim()) _errors.email = true;
    else _errors.email = false;

    if (number.trim().length < 13) _errors.number = true;
    else _errors.number = false;

    if (!password.trim() && password.trim().length < 6) _errors.password = true;
    else _errors.password = false;

    if (confirm.trim() !== password.trim()) _errors.confirm = true;
    else _errors.confirm = false;

    if (!license) _errors.license = true;
    else _errors.license = false;

    let _count = 0;
    Object.keys(_errors).forEach((key) => {
      // @ts-ignore
      if (_errors[key]) _count++;
    });

    setErrors(() => ({ ..._errors }));
    return _count === 0;
  };

  const signup = () => {
    if (isValid()) {
      setLoading(true);
      auth
        .createUserWithEmailAndPassword(email.trim(), password.trim())
        .then((user) => {
          maybeUploadImage(user.user, image, license);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      auth.signOut();
      Vibration.vibrate();
    }
  };

  const maybeUploadImage = async (
    user: firebase.User | null,
    image: string | undefined,
    license: string | undefined
  ) => {
    await db.collection("users").doc(user?.uid).set({
      approved: false,
      privilege: "USER",
      fullName: name.trim(),
      email: email.trim(),
      phoneNumber: number.trim(),
    });
    if (image) {
      const _image =
        Platform.OS === "ios" ? image.replace("file://", "") : image;

      const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", _image, true);
        xhr.send(null);
      });

      const ref = storage.ref(`users/${user?.uid}/profile_picture.jpg`);
      const snapshot = ref.put(blob);
      const snap = await snapshot;
      const url = await snap.ref.getDownloadURL();

      await db.collection("users").doc(user?.uid).set(
        {
          photoURL: url,
        },
        { merge: true }
      );
    }

    if (license) {
      const _license =
        Platform.OS === "ios" ? license.replace("file://", "") : license;

      const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", _license, true);
        xhr.send(null);
      });

      const ref = storage.ref(`users/${user?.uid}/license_picture.jpg`);
      const snapshot = ref.put(blob);
      const snap = await snapshot;
      const url = await snap.ref.getDownloadURL();

      await db.collection("users").doc(user?.uid).set(
        {
          licenseURL: url,
        },
        { merge: true }
      );
    }
  };

  const pickImage = async ({
    aspect = undefined,
    allowsEditing = false,
    resize = false,
    setPhoto,
  }: PickImageProps) => {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect,
      allowsEditing,
      quality: 1,
    });

    if (!result.cancelled) {
      if (resize) {
        const { uri } = await resizePhoto(result.uri, [512, 512]);
        setPhoto(uri);
      } else {
        setPhoto(result.uri);
      }
    }
  };

  const takePhoto = async ({
    aspect = undefined,
    allowsEditing = false,
    resize = false,
    setPhoto,
  }: PickImageProps) => {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect,
      allowsEditing,
      quality: 1,
    });

    if (!result.cancelled) {
      if (resize) {
        const { uri } = await resizePhoto(result.uri, [512, 512]);
        setPhoto(uri);
      } else {
        setPhoto(result.uri);
      }
    }
  };

  const resizePhoto = async (uri: string, size: [number, number]) => {
    const actions = [{ resize: { width: size[0], height: size[1] } }];
    const saveOptions = {
      base64: true,
      format: ImageManipulator.SaveFormat.JPEG,
    };
    return await ImageManipulator.manipulateAsync(uri, actions, saveOptions);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding" })}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      style={tailwind("flex flex-1")}
    >
      <ScrollView style={tailwind("flex flex-1")}>
        <View style={tailwind("m-4")}>
          <Text style={tailwind("text-xs text-gray-600 self-center mb-2")}>
            Profile Picture
          </Text>
          <View style={tailwind("w-full items-center justify-center")}>
            <Avatar
              size="xlarge"
              containerStyle={tailwind("bg-gray-300")}
              rounded
              source={image ? { uri: image } : undefined}
              icon={{ type: "feather", name: "image" }}
            >
              <Avatar.Accessory
                size={30}
                onPress={() =>
                  pickImage({
                    setPhoto: setImage,
                    aspect: [1, 1],
                    resize: true,
                    allowsEditing: true,
                  })
                }
              />
            </Avatar>
          </View>

          {!!error && (
            <Text style={tailwind("w-full text-center text-red-500 mt-4")}>
              {error}
            </Text>
          )}

          <Text
            style={tailwind(
              `text-xs mt-4 ${errors.name ? "text-red-500" : "text-gray-600"}`
            )}
          >
            Full Name {errors.name && "Required"}
          </Text>
          <Input
            disabled={loading}
            onSubmitEditing={() => emailRef.current?.focus()}
            onChangeText={setName}
            value={name}
            placeholder="John Doe"
            containerStyle={tailwind("p-0 m-0")}
            leftIcon={{ type: "feather", name: "user", size: 18 }}
            leftIconContainerStyle={tailwind("opacity-50")}
            inputStyle={tailwind("pl-2 text-sm")}
          />

          <Text
            style={tailwind(
              `text-xs ${errors.email ? "text-red-500" : "text-gray-600"}`
            )}
          >
            Email Address {errors.email && "Required"}
          </Text>
          <Input
            disabled={loading}
            onSubmitEditing={() => numberRef.current?.focus()}
            ref={emailRef}
            onChangeText={setEmail}
            value={email}
            placeholder="email@example.com"
            containerStyle={tailwind("p-0 m-0")}
            leftIcon={{ type: "feather", name: "mail", size: 18 }}
            leftIconContainerStyle={tailwind("opacity-50")}
            inputStyle={tailwind("pl-2 text-sm")}
            keyboardType="email-address"
          />

          <Text
            style={tailwind(
              `text-xs ${errors.number ? "text-red-500" : "text-gray-600"}`
            )}
          >
            Phone Number {errors.number && "Required"}
          </Text>
          <Input
            disabled={loading}
            onSubmitEditing={() => passwordRef.current?.focus()}
            ref={numberRef}
            onChangeText={(e) => {
              if (e.length < 3) setNumber("+63");
              else setNumber(e);
            }}
            value={number}
            placeholder="(+63) "
            containerStyle={tailwind("p-0 m-0")}
            leftIcon={{ type: "feather", name: "smartphone", size: 18 }}
            leftIconContainerStyle={tailwind("opacity-50")}
            inputStyle={tailwind("pl-2 text-sm")}
            maxLength={13}
            keyboardType="number-pad"
          />

          <Text
            style={tailwind(
              `text-xs ${errors.license ? "text-red-500" : "text-gray-600"}`
            )}
          >
            Drivers License {errors.license && "Required"}
          </Text>
          <View style={tailwind("mt-2 flex-1 mr-2")}>
            <View
              style={tailwind("flex flex-row items-center justify-between")}
            >
              <Avatar
                size="medium"
                containerStyle={tailwind("bg-gray-300")}
                source={license ? { uri: license } : undefined}
                icon={{ type: "feather", name: "image" }}
                onPress={() => {
                  if (license)
                    navigation.navigate("ViewPhoto", { uri: license });
                }}
                imageProps={{ resizeMode: "cover", resizeMethod: "auto" }}
              />

              <View style={tailwind("flex flex-row items-center")}>
                <TouchableOpacity
                  onPress={() =>
                    takePhoto({
                      setPhoto: setLicense,
                      allowsEditing: true,
                    })
                  }
                >
                  <Icon
                    name="camera"
                    type="feather"
                    color="#4B5563"
                    size={18}
                  />
                  <Text style={tailwind("text-xs text-gray-600")}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    pickImage({
                      setPhoto: setLicense,
                      allowsEditing: true,
                    })
                  }
                  style={tailwind("ml-4")}
                >
                  <Icon
                    name="upload"
                    type="feather"
                    color="#4B5563"
                    size={18}
                  />
                  <Text style={tailwind("text-xs text-gray-600")}>Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text
            style={tailwind(
              `text-xs mt-4 ${
                errors.password ? "text-red-500" : "text-gray-600"
              }`
            )}
          >
            Password {errors.password && "Required"}
          </Text>
          <Input
            disabled={loading}
            onSubmitEditing={() => confirmRef.current?.focus()}
            ref={passwordRef}
            onChangeText={setPassword}
            value={password}
            placeholder="••••••"
            containerStyle={tailwind("p-0 m-0")}
            leftIcon={{ type: "feather", name: "key", size: 18 }}
            leftIconContainerStyle={tailwind("opacity-50")}
            inputStyle={tailwind("pl-2 text-sm")}
            secureTextEntry={!passwordVisible}
            rightIcon={
              <Icon
                onPress={() => setPasswordVisible(!passwordVisible)}
                type="feather"
                name={`${passwordVisible ? "eye-off" : "eye"}`}
                size={18}
              />
            }
          />

          <Text
            style={tailwind(
              `text-xs ${errors.confirm ? "text-red-500" : "text-gray-600"}`
            )}
          >
            {errors.confirm ? "Passwords do not match" : "Confirm Password"}
          </Text>
          <Input
            disabled={loading}
            ref={confirmRef}
            onChangeText={setConfirm}
            value={confirm}
            placeholder="••••••"
            containerStyle={tailwind("p-0 m-0")}
            leftIcon={{ type: "feather", name: "key", size: 18 }}
            leftIconContainerStyle={tailwind("opacity-50")}
            inputStyle={tailwind("pl-2 text-sm")}
            secureTextEntry={!confirmVisible}
            rightIcon={
              <Icon
                onPress={() => setConfirmVisible(!confirmVisible)}
                type="feather"
                name={`${confirmVisible ? "eye-off" : "eye"}`}
                size={18}
              />
            }
          />

          <Button title="Confirm" onPress={signup} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
