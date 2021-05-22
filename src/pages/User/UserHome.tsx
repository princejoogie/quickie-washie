import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Icon, SearchBar } from "react-native-elements";
import tailwind from "tailwind-rn";
import { Divider } from "../../components";
import { DatabaseContext } from "../../contexts/DatabaseContext";
import { auth } from "../../lib/firebase";
import * as Location from "expo-location";

interface ResProp {
  lat: number;
  long: number;
  city: string;
  street: string;
}

const Home: React.FC = () => {
  const { data } = useContext(DatabaseContext);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResProp[]>([]);
  const [noResult, setNoResult] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => auth.signOut()}>
          <Icon name="logout" />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: tailwind("mr-2"),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Profile Page", `Hi, ${data?.fullName ?? "User"}`);
          }}
        >
          <Icon name="user" type="feather" />
        </TouchableOpacity>
      ),
      headerLeftContainerStyle: tailwind("ml-2"),
    });
  }, []);

  const searchCarwash = async (text: string) => {
    if (text) {
      setLoading(() => true);
      const res = await Location.geocodeAsync(text);

      if (res.length <= 0) {
        setNoResult(() => true);
        return;
      } else {
        setNoResult(() => false);
      }

      const _results: ResProp[] = [];
      for (let i = 0; i < res.length; i++) {
        const { latitude, longitude } = res[i];
        const _addr = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const address = _addr[0];

        _results.push({
          lat: latitude,
          long: longitude,
          city: address.city ?? "N/A",
          street: address.street ?? "N/A",
        });
      }
      setResults(() => [..._results]);
      setLoading(() => false);
    }
  };

  return (
    <ScrollView style={tailwind("flex flex-1")}>
      <View style={tailwind("w-full flex flex-row bg-gray-200 p-4")}>
        <Avatar
          size="large"
          containerStyle={tailwind("bg-gray-300")}
          rounded
          source={data?.photoURL ? { uri: data.photoURL } : undefined}
          icon={{ type: "feather", name: "image" }}
        />

        <View style={tailwind("ml-4 flex justify-center flex-1")}>
          <Text numberOfLines={1} style={tailwind("text-lg")}>
            {data?.fullName ?? "Full Name"}
          </Text>
          <Text numberOfLines={1} style={tailwind("text-gray-500")}>
            {data?.email ?? "email@example.com"}
          </Text>
          <Text
            numberOfLines={1}
            style={tailwind("mt-1 text-xs text-gray-500")}
          >
            {data?.phoneNumber ?? "phone"}
          </Text>
        </View>
      </View>

      <View
        style={tailwind(
          "p-4 flex w-full flex-row items-center justify-between"
        )}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("UserOwnedCars")}
          style={tailwind("mr-2 flex-1 items-center justify-center")}
        >
          <Icon name="directions-car" type="material-icons" />
          <Text style={tailwind("text-xs text-gray-600")}>Owned Cars</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("UserHistory")}
          style={tailwind("mx-2 flex-1 items-center justify-center")}
        >
          <Icon name="history" type="material-icons" />
          <Text style={tailwind("text-xs text-gray-600")}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("UserAppointments")}
          style={tailwind("ml-2 flex-1 items-center justify-center")}
        >
          <Icon name="calendar" type="feather" />
          <Text style={tailwind("text-xs text-gray-600")}>Appointments</Text>
        </TouchableOpacity>
      </View>

      <Divider />

      <View style={tailwind("p-4")}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => searchCarwash(query)}
          onClear={() => setResults([])}
          containerStyle={tailwind(
            "bg-transparent border rounded border-gray-400 m-0 p-0"
          )}
          inputContainerStyle={tailwind("bg-transparent")}
          inputStyle={tailwind("text-sm")}
          placeholder="Search car wash shops..."
          platform={Platform.OS === "ios" ? "ios" : "android"}
        />
      </View>

      <View style={tailwind("px-4 pb-4")}>
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : noResult ? (
          <Text>No Result</Text>
        ) : (
          results.map((result, i) => (
            <View
              key={`key${i}-${result.lat}-${result.long}`}
              style={tailwind("bg-gray-200 rounded p-2")}
            >
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://waze.com/ul?ll=${result.lat},${result.long}&z=10`
                  )
                }
              >
                <Text style={tailwind("text-blue-500 underline")}>
                  Show in Waze
                </Text>
              </TouchableOpacity>

              <Text style={tailwind("text-xs text-gray-500 mt-1")}>City</Text>
              <Text>{result.city}</Text>

              <Text style={tailwind("text-xs text-gray-500 mt-1")}>Street</Text>
              <Text>{result.street}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default Home;
