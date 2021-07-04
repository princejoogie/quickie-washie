import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../../constants";
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db } from "../../../lib/firebase";
import { Appointment } from "../../../types/data-types";
import {} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Icon } from "react-native-elements";
import {
  formatAppointmentDate,
  formatSeconds,
  getTimeDiff,
} from "../../../lib/helpers";

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useContext(DatabaseContext);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const listener = db
      .collection("appointments")
      .where("shopID", "==", user?.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setLoading(() => false);
        if (snapshot.docs.length <= 0) setNoData(() => true);
        else {
          setNoData(() => false);
          setAppointments(
            snapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Appointment)
            )
          );
        }
      });

    return listener;
  }, []);

  return loading ? (
    <ActivityIndicator style={tailwind("mt-4")} size="small" color="#000" />
  ) : noData ? (
    <Text style={tailwind("text-center mt-4")}>No Appointments</Text>
  ) : (
    <ScrollView>
      <View style={tailwind("px-4 pt-2 pb-4")}>
        {appointments.map((apt) => (
          <Item key={apt.id} apt={apt} />
        ))}
      </View>
    </ScrollView>
  );
};

interface ItemProp {
  apt: Appointment;
}

const Item: React.FC<ItemProp> = ({ apt }) => {
  const navigation = useNavigation();
  let interval = 0;
  const date = new Date(apt.appointmentDate);
  const [diff, setDiff] = useState(getTimeDiff(new Date(), date));
  const [hasPassed, setHasPassed] = useState(false);

  useEffect(() => {
    const _diff = getTimeDiff(new Date(), date);
    if (_diff && _diff <= 0) {
      clearInterval(interval);
      setHasPassed(true);
    } else setDiff(_diff);

    interval = setInterval(() => {
      const _diff = getTimeDiff(new Date(), date);
      if (_diff) {
        if (_diff < 1) {
          clearInterval(interval);
          setHasPassed(true);
        } else {
          setDiff(_diff);
        }
      } else clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [apt]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("AppointmentItem", { appointment: apt });
      }}
      key={apt.id}
      activeOpacity={0.7}
      style={[
        tailwind("flex flex-row p-2 bg-white mt-2 rounded"),
        { ...SHADOW_SM },
      ]}
    >
      <View style={tailwind("flex-1 items-start mr-2")}>
        <Text numberOfLines={2} style={tailwind("flex-1 font-bold text-black")}>
          {apt.service.name}
        </Text>
        <View style={tailwind("items-center mt-2 flex flex-row")}>
          <Text style={tailwind("text-xs text-gray-500")}>Vehicle: </Text>
          <Text style={tailwind("text-xs")}>{apt.vehicle.plateNumber}</Text>
        </View>
        <View style={tailwind("items-center flex flex-row")}>
          <Text style={tailwind("text-xs text-gray-500")}>Date: </Text>
          <Text style={tailwind("text-xs")}>
            {formatAppointmentDate(date, date)}
          </Text>
        </View>

        {!!diff && apt.status === "ON-GOING" && (
          <View style={tailwind("mt-1")}>
            {!hasPassed ? (
              <Text style={tailwind("text-xs")}>
                {formatSeconds(diff)} before appointment
              </Text>
            ) : (
              <Text style={tailwind("text-xs text-red-500")}>
                Appointment Date has passed
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={tailwind("items-end justify-between")}>
        <Text
          style={tailwind(
            `text-xs ${
              apt.status === "CANCELLED" ? "text-red-500" : "text-green-700"
            }`
          )}
        >
          {apt.status}
        </Text>

        <Icon name="chevron-right" type="feather" color="#4B5563" />
      </View>
    </TouchableOpacity>
  );
};

export default Appointments;
