import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import tailwind from "tailwind-rn";
import { Icon } from "react-native-elements";
import { useRoute } from "@react-navigation/core";
import { formatAppointmentDate } from "../../../lib/helpers";
import { db, timestamp } from "../../../lib/firebase";
import {
  CarProp,
  NotificationItem,
  Service,
  ShopProps,
} from "../../../types/data-types";
import { TextInput } from "react-native";
import { SHADOW_SM } from "../../../constants";

const ChangeAptDate: React.FC = ({ navigation }: any) => {
  const route = useRoute();
  const { appointmentDate, id, userID, shopID, service, car } =
    route.params as {
      appointmentDate: string;
      id: string;
      userID: string;
      shopID: string;
      service: Service;
      car: CarProp;
    };
  const [date, setDate] = useState(new Date(appointmentDate));
  const [time, setTime] = useState(new Date(appointmentDate));
  const [mode, setMode] = useState<"time" | "date">("date");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("-----------------");
    console.log(`hour = ${time.getHours()}`);
    console.log(`mins = ${time.getMinutes()}`);
    console.log(`secs = ${time.getSeconds()}`);
    console.log(`allowed = ${allowed}`);

    if (time.getHours() < 6 || time.getHours() > 18) {
      setAllowed(() => false);
    } else setAllowed(() => true);
  }, [time]);

  const onChange = (_: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    if (mode === "date") setDate(currentDate);
    else setTime(currentDate);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const getFinalDate = () => {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      0,
      0
    );
  };

  return (
    <View style={tailwind("flex flex-1")}>
      <View style={tailwind("absolute z-50 bottom-2 inset-x-2")}>
        <Text style={tailwind("text-xs text-gray-600")}>Reason (optional)</Text>
        <TextInput
          multiline
          numberOfLines={5}
          value={message}
          onChangeText={setMessage}
          placeholder="Slot Not Available"
          textAlignVertical="top"
          style={[tailwind("mt-1 bg-white p-2 h-20 rounded"), { ...SHADOW_SM }]}
        />
        <View style={tailwind("mt-2")}>
          <Text style={tailwind("text-xs text-center text-gray-600")}>
            Selected Appointment Date and Time:
          </Text>
          <Text
            style={tailwind("px-2 py-1 text-center bg-gray-300 rounded mt-1")}
          >
            {formatAppointmentDate(date, time)}{" "}
          </Text>
        </View>

        {!allowed && (
          <Text style={tailwind("text-xs text-red-500 text-center mt-2")}>
            Open only from 6am to 6pm
          </Text>
        )}

        <TouchableOpacity
          disabled={!allowed}
          onPress={async () => {
            setLoading(() => true);
            try {
              const _appointmentDate = getFinalDate().toISOString();
              await db.collection("appointments").doc(id).update({
                appointmentDate: _appointmentDate,
              });
              const shop = (
                await db.collection("users").doc(shopID).get()
              ).data() as ShopProps;
              await db
                .collection("users")
                .doc(userID)
                .collection("notifications")
                .add({
                  title: "Appointment Date Changed",
                  content: `Service: ${service.name} \nVehicle: ${
                    car.plateNumber
                  } \nNew Date: ${formatAppointmentDate(date, time)}${
                    !!message ? `\nReason: ${message}` : ""
                  }`,
                  timestamp: timestamp(),
                  opened: false,
                  photoURL: !!shop.photoURL ? shop.photoURL : "",
                  shopName: shop.shopName,
                } as NotificationItem);
            } catch (err) {
              console.log(err);
            }

            navigation.popToTop();
          }}
          activeOpacity={0.5}
          style={tailwind(
            `flex mt-1 flex-row p-2 bg-green-500 rounded items-center justify-center ${
              !allowed ? "opacity-30" : "opacity-100"
            }`
          )}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={tailwind("text-white rounded")}>Confirm Changes</Text>
          )}
          <View style={tailwind("absolute right-2")}>
            <Icon name="check" type="feather" color="#ffffff" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={tailwind("flex flex-1")}>
        <View
          style={tailwind("flex items-center justify-center px-4 pt-4 pb-2")}
        >
          <TouchableOpacity onPress={showDatepicker}>
            <Text style={tailwind("text-blue-600 uppercase")}>
              Choose a Date
            </Text>
          </TouchableOpacity>
        </View>

        <View style={tailwind("flex items-center justify-center px-4 py-2")}>
          <TouchableOpacity onPress={showTimepicker}>
            <Text style={tailwind("text-blue-600 uppercase")}>Choose Time</Text>
          </TouchableOpacity>
        </View>

        {show && (
          <DateTimePicker
            minimumDate={new Date()}
            value={mode === "date" ? date : time}
            mode={mode}
            is24Hour={false}
            display="spinner"
            onChange={onChange}
          />
        )}

        <View style={tailwind("w-full h-36")} />
      </ScrollView>
    </View>
  );
};

export default ChangeAptDate;
