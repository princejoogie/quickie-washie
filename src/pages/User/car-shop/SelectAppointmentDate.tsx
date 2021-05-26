import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import tailwind from "tailwind-rn";
import { DAYS, MONTHS } from "../../../constants";
import { Icon } from "react-native-elements";

const SelectAppointmentDate: React.FC = () => {
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

  const formatTime = () => {
    let _hours = time.getHours().toString();
    if (_hours.length <= 1) _hours = "0" + _hours;
    let _min = time.getMinutes().toString();
    if (_min.length <= 1) _min = "0" + _min;

    return `${_hours}:${_min}`;
  };
  const formatAppointmentDate = () => {
    return `${DAYS[date.getDay()]}, ${date.getDate()} ${
      MONTHS[date.getMonth()]
    } ${date.getFullYear()} at ${formatTime()}`;
  };

  return (
    <View style={tailwind("flex flex-1")}>
      <TouchableOpacity
        onPress={() => {
          console.log(getFinalDate().toLocaleDateString());
          console.log(getFinalDate().toLocaleTimeString());
        }}
        activeOpacity={0.5}
        style={tailwind(
          "flex flex-row absolute z-50 bottom-2 inset-x-2 p-2 bg-green-500 rounded items-center justify-center"
        )}
      >
        <Text style={tailwind("text-white rounded")}>Choose a Vehicle</Text>
        <View style={tailwind("absolute right-2")}>
          <Icon name="arrow-right" type="feather" color="#ffffff" />
        </View>
      </TouchableOpacity>

      <ScrollView style={tailwind("flex flex-1 p-4")}>
        <View>
          <Button onPress={showDatepicker} title="Choose a Date" />
        </View>
        <View style={tailwind("my-2")}>
          <Button onPress={showTimepicker} title="Choose Time" />
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

        <View style={tailwind("mt-4")}>
          <Text style={tailwind("text-xs text-gray-600")}>
            Selected Appointment Date and Time:
          </Text>
          <Text style={tailwind("px-2 py-1 bg-gray-300 rounded mt-1")}>
            {formatAppointmentDate()}{" "}
          </Text>
        </View>

        <View style={tailwind("w-full h-20")} />
      </ScrollView>
    </View>
  );
};

export default SelectAppointmentDate;
