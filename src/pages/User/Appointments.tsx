import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../constants";
import { DatabaseContext } from "../../contexts/DatabaseContext";
import { db } from "../../lib/firebase";
import { Appointment } from "../../types/data-types";

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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
          <View
            key={apt.id}
            style={[tailwind("p-2 rounded bg-white mt-2"), { ...SHADOW_SM }]}
          >
            <Text>{apt.appointmentDate}</Text>
            <Text>{apt.service.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Appointments;
