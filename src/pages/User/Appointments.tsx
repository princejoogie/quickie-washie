import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { SHADOW_SM } from "../../constants";
import { DatabaseContext } from "../../contexts/DatabaseContext";
import { db } from "../../lib/firebase";
import { Appointment } from "../../types/data-types";

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useContext(DatabaseContext);

  useEffect(() => {
    const listener = db
      .collection("appointments")
      .where("userID", "==", user?.uid)
      .where("status", "==", "ON-GOING")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setAppointments(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Appointment)
          )
        );
      });

    return listener;
  }, []);

  return (
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
