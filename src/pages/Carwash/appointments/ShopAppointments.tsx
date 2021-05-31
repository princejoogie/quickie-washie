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
import { AppoitmentItem } from "../../../types/data-types";
import {} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Icon } from "react-native-elements";
import { formatAppointmentDate } from "../../../lib/helpers";

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AppoitmentItem[]>([]);
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
              (doc) => ({ id: doc.id, ...doc.data() } as AppoitmentItem)
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
  apt: AppoitmentItem;
}

const Item: React.FC<ItemProp> = ({ apt }) => {
  const navigation = useNavigation();
  const date = new Date(apt.appointmentDate);

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
      <View style={tailwind("flex-1")}>
        <Text style={tailwind("font-bold")}>{apt.service.name}</Text>
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
      </View>

      <View style={tailwind("items-center justify-center")}>
        <Icon name="chevron-right" type="feather" color="#4B5563" />
      </View>
    </TouchableOpacity>
  );
};

export default Appointments;