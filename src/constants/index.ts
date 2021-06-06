import { Dimensions } from "react-native";
import { CarType, NCRCity } from "../types/data-types";

export const WIDTH = Dimensions.get("window").width;
export const HEIGHT = Dimensions.get("window").height;

export const SHADOW_SM = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.18,
  shadowRadius: 1.0,
  elevation: 1,
};

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const CITIES: Array<NCRCity> = [
  "Caloocan",
  "Las Piñas",
  "Makati",
  "Marikina",
  "Muntinlupa",
  "Navotas",
  "Parañaque",
  "Pasay",
  "Pateros",
  "Quezon City",
  "San Juan",
  "Taguig",
  "Valenzuela",
];

export const CarList: Array<CarType> = [
  "Sedan (4 Door)",
  "Sedan (2 Door)",
  "Sports Car",
  "Station Wagon",
  "Hatchback",
  "Convertible",
  "SUV",
  "Minivan",
  "Pickup Truck",
];
