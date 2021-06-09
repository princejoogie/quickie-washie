import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import tailwind from "tailwind-rn";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { User } from "../types/data-types";
import { DatabaseContext } from "../contexts/DatabaseContext";
import { auth, db, storage } from "../lib/firebase";
import { SHADOW_SM } from "../constants";

const EditProfile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, data: oldData } = useContext(DatabaseContext);
  const data = oldData as User;
  const [fullName, setFullName] = useState(data.fullName);
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber);
  const [image, setImage] = useState<string | undefined>("");
  const [same, setSame] = useState(true);
  const [loading, setLoading] = useState(false);

  // DEACTIVATION VARIABLES
  const [deactivating, setDeactivating] = useState(false);
  const [modalShown, setModalShown] = useState(false);
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleChange = () => {
    let t = 0;
    if (fullName === data.fullName) t++;
    if (phoneNumber === data.phoneNumber) t++;
    if (image) {
      setSame(false);
      return;
    }
    setSame(t === 2);
  };

  useEffect(() => {
    handleChange();
  }, [fullName, phoneNumber, image]);

  const pickImage = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const { uri } = await resizePhoto(result.uri, [224, 224]);
      setImage(uri);
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

  const update = async () => {
    if (user) {
      setLoading(() => true);
      await db.collection("users").doc(user.uid).update({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
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

        await db.collection("users").doc(user?.uid).update({
          photoURL: url,
        });

        setLoading(() => false);
        navigation.popToTop();
      } else {
        setLoading(() => false);
        navigation.popToTop();
      }
    }
  };

  const deactivate = async () => {
    if (user) {
      const appointments = await db
        .collection("appointments")
        .where("userID", "==", user.uid)
        .get();
      appointments.forEach(async (apt) => {
        await db.collection("appointments").doc(apt.id).delete();
      });

      const notifications = await db
        .collection("users")
        .doc(user.uid)
        .collection("notifications")
        .get();
      notifications.forEach(async (notif) => {
        await db
          .collection("users")
          .doc(user.uid)
          .collection("notifications")
          .doc(notif.id)
          .delete();
      });

      const shops = await db
        .collection("users")
        .where("privilege", "==", "CARWASH_OWNER")
        .get();
      shops.forEach(async (shop) => {
        const shopRef = db.collection("users").doc(shop.id);
        const questions = await shopRef
          .collection("questions")
          .where("userID", "==", user.uid)
          .get();

        questions.forEach(async (q) => {
          await shopRef.collection("questions").doc(q.id).delete();
        });
      });

      const cars = await db
        .collection("users")
        .doc(user.uid)
        .collection("cars")
        .get();
      cars.forEach(async (car) => {
        await db
          .collection("users")
          .doc(user.uid)
          .collection("cars")
          .doc(car.id)
          .delete();
      });

      if (!!data.licenseURL) await storage.refFromURL(data.licenseURL).delete();
      if (!!data.photoURL) await storage.refFromURL(data.photoURL).delete();
      await db.collection("users").doc(user.uid).delete();

      await auth.currentUser?.delete();
      await auth.signOut();
    }
  };

  return (
    <ScrollView style={tailwind("flex flex-1")}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalShown}
        onRequestClose={() => {
          setModalShown(!modalShown);
        }}
      >
        <View
          style={[
            tailwind("absolute flex-row inset-0 items-center justify-center"),
            { backgroundColor: "rgba(0,0,0,0.3)" },
          ]}
        >
          <View
            style={[
              tailwind("flex-1 mx-4 p-2 bg-white rounded"),
              { ...SHADOW_SM },
            ]}
          >
            <Text style={tailwind("text-xs text-gray-600")}>
              Re-enter Password
            </Text>

            <TextInput
              editable={!deactivating}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setHasError(() => false);
              }}
              style={tailwind("border border-gray-300 rounded mt-2 px-3 py-2")}
              placeholder="******"
            />

            {hasError && (
              <Text style={tailwind("text-xs text-red-500")}>
                Incorrect Password.
              </Text>
            )}

            <View style={tailwind("flex flex-row items-center")}>
              <TouchableOpacity
                style={tailwind(
                  "mr-1 flex-1 flex-shrink-0 items-center justify-center mt-4 px-4 py-2 rounded"
                )}
                onPress={() => setModalShown(false)}
              >
                <Text style={tailwind("text-gray-600")}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tailwind(
                  "ml-1 flex-1 flex-shrink-0 bg-green-400 items-center justify-center mt-4 px-4 py-2 rounded"
                )}
                onPress={async () => {
                  setDeactivating(() => true);
                  try {
                    await auth.signInWithEmailAndPassword(
                      data.email,
                      password.trim()
                    );

                    await deactivate();
                  } catch (err) {
                    Vibration.vibrate();
                    setHasError(true);
                    setDeactivating(() => false);
                  }
                }}
              >
                {deactivating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={tailwind("text-white")}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView style={tailwind("m-4")}>
        <View style={tailwind("flex items-center justify-center")}>
          <Avatar
            size="xlarge"
            containerStyle={tailwind("bg-gray-300")}
            rounded
            source={
              image || data.photoURL
                ? { uri: image ? image : data.photoURL }
                : undefined
            }
            icon={{ type: "feather", name: "image" }}
          >
            <Avatar.Accessory size={30} onPress={pickImage} />
          </Avatar>
        </View>
        <Text style={tailwind("mt-4 text-xs text-gray-600")}>Full Name</Text>
        <TextInput
          editable={!loading}
          value={fullName}
          onChangeText={setFullName}
          style={[
            tailwind("mt-1 rounded px-2 bg-white h-10"),
            { ...SHADOW_SM },
          ]}
        />

        <Text style={tailwind("mt-2 text-xs text-gray-600")}>Phone Number</Text>
        <TextInput
          editable={!loading}
          value={phoneNumber}
          keyboardType="number-pad"
          maxLength={13}
          onChangeText={(e) => {
            if (e.length < 3) setPhoneNumber("+63");
            else setPhoneNumber(e);
          }}
          style={[
            tailwind("mt-1 rounded px-2 bg-white h-10"),
            { ...SHADOW_SM },
          ]}
        />

        <Text style={tailwind("mt-2 text-xs text-gray-600")}>
          Email Address
        </Text>
        <View
          style={[
            tailwind("flex mt-1 justify-center rounded px-2 bg-gray-200 h-10"),
            { ...SHADOW_SM },
          ]}
        >
          <Text>{data.email}</Text>
        </View>

        <TouchableOpacity
          onPress={update}
          activeOpacity={0.7}
          disabled={same || loading}
          style={tailwind(
            `mt-6 flex flex-row p-2 rounded items-center justify-center ${
              same ? "bg-gray-400 opacity-70" : "bg-blue-500"
            }`
          )}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={tailwind("text-white")}>Update</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={deactivating}
          onPress={() => {
            Alert.alert(
              "Confirm",
              "Are you sure you want to deativate your account? This action cannot be undone.",
              [
                {
                  text: "Cancel",
                },
                {
                  text: "OK",
                  onPress: () => setModalShown(true),
                },
              ]
            );
          }}
          style={tailwind("self-center mt-4")}
        >
          <Text style={tailwind("text-red-500")}>Deactivate Account</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default EditProfile;
