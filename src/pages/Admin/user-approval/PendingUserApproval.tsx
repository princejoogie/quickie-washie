import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { db } from "../../../lib/firebase";
import { User } from "../../../types/data-types";

const PendingUserApproval: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const listener = db
      .collection("users")
      .where("approved", "==", false)
      .where("privilege", "==", "USER")
      .onSnapshot((snapshot) => {
        setLoading(() => false);
        if (snapshot.docs.length <= 0) setNoData(() => true);
        else {
          setNoData(() => false);
          setUsers(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User))
          );
        }
      });

    return listener;
  }, []);

  return (
    <ScrollView style={tailwind("flex flex-1")}>
      <View style={tailwind("px-4 pb-4 pt-2")}>
        {loading ? (
          <ActivityIndicator
            style={tailwind("mt-2")}
            size="small"
            color="#000"
          />
        ) : noData ? (
          <Text style={tailwind("text-center mt-2")}>No Pending Users.</Text>
        ) : (
          users.map((user) => <UserItem key={user.id} user={user} />)
        )}
      </View>
    </ScrollView>
  );
};

interface Props {
  user: User;
}

const UserItem: React.FC<Props> = ({ user }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("UserDetails", { user });
      }}
      activeOpacity={0.7}
      style={[
        tailwind(
          "flex flex-row items-center justify-between p-2 rounded bg-white mt-2"
        ),
        { ...SHADOW_SM },
      ]}
    >
      <Avatar
        size="small"
        containerStyle={tailwind("bg-gray-300")}
        rounded
        source={user.photoURL ? { uri: user.photoURL } : undefined}
        icon={{ type: "feather", name: "image" }}
      />

      <View style={tailwind("flex-1 ml-2")}>
        <Text numberOfLines={1} style={tailwind("w-full")}>
          {user.fullName}
        </Text>
        <Text
          numberOfLines={1}
          style={tailwind("w-full text-xs text-gray-600")}
        >
          {user.email}
        </Text>
      </View>

      <Icon name="chevron-right" type="feather" />
    </TouchableOpacity>
  );
};

export default PendingUserApproval;
