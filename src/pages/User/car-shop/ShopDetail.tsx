import { useNavigation, useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import tailwind from "tailwind-rn";
import { Spacer } from "../../../components";
import { FAQs } from "../../../components/user/car-shop";
import { SHADOW_SM, WIDTH } from "../../../constants";
import { db } from "../../../lib/firebase";
import { Service, ShopProps } from "../../../types/data-types";

const ShopDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { shop } = route.params as { shop: ShopProps };
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const servicesSubscriber = db
      .collection("users")
      .doc(shop.id)
      .collection("services")
      .onSnapshot((snapshot) => {
        setLoading(() => false);
        setServices(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Service))
        );
      });

    return servicesSubscriber;
  }, []);

  return (
    <View style={tailwind("flex flex-1")}>
      {!!selectedService && (
        <TouchableOpacity
          disabled={!selectedService}
          onPress={() => {
            const service = services.find((e) => e.id === selectedService);
            navigation.navigate("SelectAppointmentDate", { shop, service });
          }}
          activeOpacity={0.5}
          style={tailwind(
            `flex flex-row absolute z-50 bottom-2 inset-x-2 p-2 rounded items-center justify-center ${
              !selectedService ? "bg-gray-300" : "bg-green-500"
            }`
          )}
        >
          <Text style={tailwind("text-white rounded")}>
            Book an Appointment
          </Text>
          <View style={tailwind("absolute right-2")}>
            <Icon name="arrow-right" type="feather" color="#ffffff" />
          </View>
        </TouchableOpacity>
      )}

      <ScrollView>
        <View
          style={tailwind("w-full flex flex-row bg-gray-200 p-4 items-center")}
        >
          <Avatar
            size="medium"
            containerStyle={tailwind("bg-gray-300")}
            rounded
            source={shop?.photoURL ? { uri: shop.photoURL } : undefined}
            icon={{ type: "feather", name: "image" }}
          />

          <View style={tailwind("ml-4 flex items-start justify-center flex-1")}>
            <Text numberOfLines={2} style={tailwind("font-bold")}>
              {shop.shopName ?? "Shop Name"}
            </Text>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                Linking.openURL(
                  `mailto:${shop.email}?subject=Appointment Booking`
                );
              }}
            >
              <Text
                numberOfLines={1}
                style={tailwind("mt-1 text-xs underline text-blue-500")}
              >
                {shop.email ?? "email@example.com"}
              </Text>
            </TouchableOpacity>

            <View style={tailwind("flex flex-row items-center")}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  if (Platform.OS === "android") {
                    Linking.openURL(`tel:${shop.phoneNumber}`);
                  } else {
                    Linking.openURL(`telprompt:${shop.phoneNumber}`);
                  }
                }}
              >
                <Text
                  numberOfLines={1}
                  style={tailwind("mt-1 text-xs underline text-blue-500")}
                >
                  {shop.phoneNumber ?? "phone"}
                </Text>
              </TouchableOpacity>

              <Text style={tailwind("mx-2 text-gray-600")}>|</Text>

              <Text style={tailwind("text-xs text-gray-600")}>{shop.city}</Text>
            </View>
          </View>
        </View>
        <View style={tailwind("p-4")}>
          <View
            style={tailwind(
              "w-full flex flex-row items-center justify-between"
            )}
          >
            <Text style={tailwind("text-gray-600")}>Location</Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  `https://www.waze.com/ul?ll=${shop.location.latitude}%2C${shop.location.longitude}&navigate=yes&zoom=17`
                );
              }}
              activeOpacity={0.5}
              style={tailwind(
                "flex flex-row items-center justify-center bg-blue-500 px-2 py-1 rounded"
              )}
            >
              <Text style={tailwind("text-xs mr-2 text-white")}>
                Open in Waze
              </Text>
              <Icon name="waze" type="font-awesome-5" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <View
            style={tailwind(
              "border border-gray-300 rounded-md overflow-hidden mt-2"
            )}
          >
            <MapView
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: shop.location.latitude,
                longitude: shop.location.longitude,
                latitudeDelta: 0.04922,
                longitudeDelta: 0.04421,
              }}
              style={[tailwind("w-full"), { height: WIDTH * (2 / 3) }]}
            >
              <Marker
                coordinate={{
                  latitude: shop.location.latitude,
                  longitude: shop.location.longitude,
                }}
              />
            </MapView>
          </View>

          <View style={tailwind("mt-4")}>
            <Text style={tailwind("text-gray-600")}>Choose a Service</Text>
            {loading && (
              <ActivityIndicator
                style={tailwind("mt-2")}
                size="small"
                color="#000"
              />
            )}
            {services.map((service) => (
              <ServiceItem
                key={service.id}
                {...{ service, selectedService, setSelectedService }}
              />
            ))}
          </View>

          <FAQs shop={shop} />
        </View>

        <Spacer />
      </ScrollView>
    </View>
  );
};
interface ServiceProps {
  service: Service;
  selectedService: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
}

const ServiceItem: React.FC<ServiceProps> = ({
  service,
  selectedService,
  setSelectedService,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedService(service.id);
      }}
      activeOpacity={0.7}
      style={[
        tailwind("flex flex-row p-2 bg-white mt-2 rounded"),
        { ...SHADOW_SM },
      ]}
    >
      <View>
        {selectedService === service.id ? (
          <Icon
            name="dot-circle-o"
            type="font-awesome"
            size={20}
            color="#6366F1"
          />
        ) : (
          <Icon name="circle-o" type="font-awesome" size={20} color="#D1D5DB" />
        )}
      </View>

      <View style={tailwind("flex-1 ml-2")}>
        <Text style={tailwind("font-bold")}>{service.name}</Text>
        <View style={tailwind("items-center flex flex-row")}>
          <Text style={tailwind("text-xs text-gray-500")}>Price Range: </Text>
          <Text style={tailwind("text-xs")}>{service.price}</Text>
        </View>
        <Text style={tailwind("text-xs text-gray-500")}>Description: </Text>
        <Text numberOfLines={3} style={tailwind("ml-2 flex flex-row text-xs")}>
          {service.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ShopDetail;
