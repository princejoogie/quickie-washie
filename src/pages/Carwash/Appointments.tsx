import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { DatabaseContext } from "../../contexts/DatabaseContext";
import { db, firebase } from "../../lib/firebase";

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<
    firebase.firestore.DocumentData[]
  >([]);
  const { user } = useContext(DatabaseContext);

  useEffect(() => {
    const listener = db
      .collection("appointments")
      .where("userID", "==", user?.uid)
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        setAppointments(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });

    return listener;
  }, []);

  return (
    <ScrollView>
      <View style={tailwind("p-4")}>
        {appointments.map((apt) => (
          <Text>{apt.appointmentDate}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default Appointments;
