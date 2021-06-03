import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import tailwind from "tailwind-rn";
import { Spacer } from "../../../components";
import { SHADOW_SM } from "../../../constants";
import { DatabaseContext } from "../../../contexts/DatabaseContext";
import { db } from "../../../lib/firebase";
import { Service } from "../../../types/data-types";

interface ServicesProps {}

const Services: React.FC<ServicesProps> = () => {
  const { user } = useContext(DatabaseContext);
  const navigation = useNavigation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const servicesSubscriber = db
      .collection("users")
      .doc(user?.uid)
      .collection("services")
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length <= 0) {
          setNoData(true);
          setLoading(false);
        } else {
          setNoData(false);
          setServices(
            snapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Service)
            )
          );
          setLoading(false);
        }
      });

    return servicesSubscriber;
  }, []);

  return (
    <View style={tailwind("flex flex-1")}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("AddService");
        }}
        activeOpacity={0.7}
        style={tailwind(
          "p-2 rounded-full bg-blue-500 z-50 absolute bottom-4 right-4"
        )}
      >
        <Icon name="plus" type="feather" color="#FFFFFF" />
      </TouchableOpacity>
      <ScrollView style={tailwind("flex flex-1")}>
        {loading ? (
          <ActivityIndicator
            style={tailwind("mt-4")}
            size="small"
            color="#000"
          />
        ) : noData ? (
          <Text style={tailwind("text-center mt-4")}>No Services.</Text>
        ) : (
          <View style={tailwind("px-4 pt-2 pb-4")}>
            {services.map((service) => (
              <ServiceItem key={service.id} service={service} />
            ))}
          </View>
        )}
        <Spacer />
      </ScrollView>
    </View>
  );
};

interface ServiceProps {
  service: Service;
}

const ServiceItem: React.FC<ServiceProps> = ({ service }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("UpdateService", { service });
      }}
      activeOpacity={0.7}
      style={[
        tailwind("flex flex-row p-2 bg-white mt-2 rounded"),
        { ...SHADOW_SM },
      ]}
    >
      <View style={tailwind("flex-1")}>
        <Text style={tailwind("font-bold")}>{service.name}</Text>
        <View style={tailwind("items-center flex flex-row")}>
          <Text style={tailwind("text-xs text-gray-500")}>Price Range: </Text>
          <Text style={tailwind("text-xs")}>{service.priceRange}</Text>
        </View>
        <Text style={tailwind("text-xs text-gray-500")}>Description: </Text>
        <Text numberOfLines={3} style={tailwind("ml-2 flex flex-row text-xs")}>
          {service.description}
        </Text>
      </View>

      <View style={tailwind("items-center justify-center")}>
        <Icon name="chevron-right" type="feather" color="#4B5563" />
      </View>
    </TouchableOpacity>
  );
};
export default Services;
