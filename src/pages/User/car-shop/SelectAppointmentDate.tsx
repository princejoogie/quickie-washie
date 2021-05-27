import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import tailwind from "tailwind-rn";
import { DAYS, MONTHS } from "../../../constants";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";

const SelectAppointmentDate: React.FC = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState<"time" | "date">("date");
  const [show, setShow] = useState(false);

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
      time.getSeconds(),
      time.getMilliseconds()
    );
  };

  const formatTime = (time: any) => {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? "AM" : "PM";
      time[0] = +time[0] % 12 || 12;
    }

    time.splice(3, 2);
    return time.join("");
  };

  const formatAppointmentDate = () => {
    return `${DAYS[date.getDay()]}, ${date.getDate()} ${
      MONTHS[date.getMonth()]
    } ${date.getFullYear()} at ${formatTime(time.toLocaleTimeString())}`;
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
            {formatAppointmentDate()}{" "}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            const appointmentDate = getFinalDate().toISOString();
            navigation.navigate("SelectVehicle", { appointmentDate });
          }}
          activeOpacity={0.5}
          style={tailwind(
            "flex mt-2 flex-row p-2 bg-green-500 rounded items-center justify-center"
          )}
        >
          <Text style={tailwind("text-white rounded")}>Choose a Vehicle</Text>
          <View style={tailwind("absolute right-2")}>
            <Icon name="arrow-right" type="feather" color="#ffffff" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={tailwind("flex flex-1 p-4")}>
        <View style={tailwind("flex items-center justify-center p-2")}>
          <TouchableOpacity onPress={showDatepicker}>
            <Text style={tailwind("text-blue-600 uppercase")}>
              Choose a Date
            </Text>
          </TouchableOpacity>
        </View>

        <View style={tailwind("flex items-center justify-center p-2")}>
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

export default SelectAppointmentDate;
