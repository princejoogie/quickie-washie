import { firebase } from "../lib/firebase";
export type Privilege = "ADMIN" | "USER" | "CARWASH_OWNER";

export type NCRCity =
  | "Caloocan"
  | "Las Piñas"
  | "Makati"
  | "Marikina"
  | "Muntinlupa"
  | "Navotas"
  | "Parañaque"
  | "Pasay"
  | "Peateros"
  | "Quezon City"
  | "San Juan"
  | "Taguig"
  | "Valenzuela";

export type LocType = {
  latitude: number;
  longitude: number;
};

export type CarType =
  | "Bus / Truck"
  | "Hatchback / Sedan"
  | "Jeep / SUV"
  | "Motorcycle / Scooter";

interface CarProp {
  type: CarType;
  id: string;
  plateNumber: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  photoURL?: string;
  privilege: Privilege;
}

interface ShopProps extends User {
  city: NCRCity;
  location: LocType;
  permitURL?: string | undefined;
  shopName: string;
  approved: boolean;
}

interface Service {
  id: string;
  name: string;
  priceRange: string;
  description: string;
}

type AppointmentStatus = "ON-GOING" | "FINISHED" | "CANCELLED";
interface Appointment {
  id: string;
  shopID: string;
  userID: string;
  service: Service;
  appointmentDate: string;
  vehicle: CarProp;
  status: AppointmentStatus;
  timestamp: any;
}

interface AppoitmentItem {
  id: string;
  appointmentDate: string;
  service: Service;
  shopID: string;
  status: AppointmentStatus;
  timestamp: any;
  userID: string;
  vehicle: CarProp;
}

interface Question {
  id: string;
  userID: string;
  user: {
    name: string;
    photoURL?: string;
  };
  question: string;
  answer: string;
  timestamp: any;
}
