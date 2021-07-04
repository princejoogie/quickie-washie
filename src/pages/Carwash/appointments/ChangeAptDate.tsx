import React, { useState } from "react";
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
import { db } from "../../../lib/firebase";

const ChangeAptDate: React.FC = ({ navigation }: any) => {
  const route = useRoute();
  const { appointmentDate, id } = route.params as {
    appointmentDate: string;
    id: string;
  };
  const [date, setDate] = useState(new Date(appointmentDate));
  const [time, setTime] = useState(new Date(appointmentDate));
  const [mode, setMode] = useState<"time" | "date">("date");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

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
        <View style={tailwind("mt-4")}>
          <Text style={tailwind("text-xs text-center text-gray-600")}>
            Selected Appointment Date and Time:
          </Text>
          <Text
            style={tailwind("px-2 py-1 text-center bg-gray-300 rounded mt-1")}
          >
            {formatAppointmentDate(date, time)}{" "}
          </Text>
        </View>

        <TouchableOpacity
          onPress={async () => {
            setLoading(() => true);
            const appointmentDate = getFinalDate().toISOString();
            await db.collection("appointments").doc(id).update({
              appointmentDate,
            });
            navigation.popToTop();
          }}
          activeOpacity={0.5}
          style={tailwind(
            "flex mt-2 flex-row p-2 bg-green-500 rounded items-center justify-center"
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
