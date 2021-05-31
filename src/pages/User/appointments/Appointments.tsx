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

const Appointments: React.FC = () => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState<AppoitmentItem[]>([]);
  const { user } = useContext(DatabaseContext);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const listener = db
      .collection("appointments")
      .where("userID", "==", user?.uid)
      .where("status", "==", "ON-GOING")
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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AppointmentItem", { appointment: apt });
            }}
            key={apt.id}
            style={[tailwind("p-2 rounded bg-white mt-2"), { ...SHADOW_SM }]}
          >
            <Text>{apt.appointmentDate}</Text>
            <Text>{apt.service.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Appointments;
