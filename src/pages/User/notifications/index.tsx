import { useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-elements";
import tailwind from "tailwind-rn";
import { Divider } from "../../../components";
import { db } from "../../../lib/firebase";
import { NotificationItem } from "../../../types/data-types";

const index: React.FC = () => {
  const route = useRoute();
  const { id } = route.params as {
    id: string;
  };
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotif, setSelectedNotif] =
    useState<NotificationItem | null>(null);

  useEffect(() => {
    const listener = db
      .collection("users")
      .doc(id)
      .collection("notifications")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        setLoading(() => false);

        if (snapshot.docs.length <= 0) setNoData(() => true);
        else {
          setNoData(() => false);
          setNotifications(
            snapshot.docs.map(
              (doc) =>
                ({
                  id: doc.id,
                  ...doc.data(),
                } as NotificationItem)
            )
          );
        }
      });

    return listener;
  }, []);

  return (
    <ScrollView>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View
          style={[
            tailwind("flex flex-row flex-1 items-center justify-center"),
            { backgroundColor: "rgba(0,0,0,0.5)" },
          ]}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            activeOpacity={1}
            style={tailwind("absolute inset-0 z-10")}
          />
          {selectedNotif && (
            <ModalNotif {...{ notif: selectedNotif, id, setModalVisible }} />
          )}
        </View>
      </Modal>

      <View style={tailwind("pb-4 pt-3")}>
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : noData ? (
          <Text style={tailwind("text-center")}>You're all caught up</Text>
        ) : (
          notifications.map((notif) => (
            <Notif
              key={notif.id}
              {...{ id, notif, setModalVisible, setSelectedNotif }}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

interface ModalNotifProps {
  notif: NotificationItem;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

const ModalNotif: React.FC<ModalNotifProps> = ({
  notif,
  id,
  setModalVisible,
}) => {
  const date = notif.timestamp.toDate() as Date;

  const deleteNotif = async () => {
    await db
      .collection("users")
      .doc(id)
      .collection("notifications")
      .doc(notif.id)
      .delete();
    setModalVisible(false);
  };

  return (
    <View style={tailwind("bg-white flex-1 p-4 rounded z-30 m-4")}>
      <View style={tailwind("flex flex-row items-center justify-between")}>
        <Text style={tailwind("text-xs text-gray-500")}>
          {date.toLocaleDateString()}
        </Text>

        <TouchableOpacity onPress={deleteNotif}>
          <Text style={tailwind("text-red-500 text-xs")}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Text style={tailwind("text-black font-bold text-lg")}>
        {notif.title}
      </Text>
      <Text style={tailwind("text-black mt-1")}>{notif.content}</Text>

      <Divider className="px-0 my-2" />
      <View style={tailwind("flex flex-row items-center")}>
        <Avatar
          size="small"
          containerStyle={tailwind("bg-gray-300")}
          rounded
          source={notif.photoURL ? { uri: notif.photoURL } : undefined}
          icon={{ type: "feather", name: "image" }}
        />

        <Text
          numberOfLines={2}
          style={tailwind("mx-2 text-xs text-black flex-1 text-gray-700")}
        >
          {notif.shopName}
        </Text>
      </View>
    </View>
  );
};

interface NotifProps {
  notif: NotificationItem;
  id: string;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedNotif: React.Dispatch<
    React.SetStateAction<NotificationItem | null>
  >;
}

const Notif: React.FC<NotifProps> = ({
  notif,
  id,
  setModalVisible,
  setSelectedNotif,
}) => {
  const date = notif.timestamp.toDate() as Date;
  const openNotification = (notif: NotificationItem) => {
    setSelectedNotif(() => {
      setModalVisible(true);
      return notif;
    });

    if (!notif.opened) {
      db.collection("users")
        .doc(id)
        .collection("notifications")
        .doc(notif.id)
        .update({
          opened: true,
        });
    }
  };

  return (
    <TouchableOpacity
      onPress={() => openNotification(notif)}
      activeOpacity={0.7}
      style={tailwind(
        `p-2 mt-1 ${notif.opened ? "bg-gray-100" : "bg-gray-300"}`
      )}
    >
      <View style={tailwind("flex flex-row items-center")}>
        <Avatar
          size="small"
          containerStyle={tailwind("bg-gray-300")}
          rounded
          source={notif.photoURL ? { uri: notif.photoURL } : undefined}
          icon={{ type: "feather", name: "image" }}
        />

        <View style={tailwind("mx-2 flex-1")}>
          <Text numberOfLines={1} style={tailwind("text-black font-bold")}>
            {notif.title}
          </Text>

          <Text numberOfLines={3} style={tailwind("text-xs text-gray-700")}>
            {notif.content}
          </Text>

          <View style={tailwind("flex flex-row mt-1")}>
            <Text numberOfLines={1} style={tailwind("flex-1 mr-2 text-xs")}>
              {notif.shopName}
            </Text>
            <Text style={tailwind("text-xs text-gray-500")}>
              {date.toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default index;
