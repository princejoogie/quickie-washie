import { firebase } from "../lib/firebase";
type Privilege = "ADMIN" | "USER" | "CARWASH_OWNER";

type NCRCity =
  | "Caloocan"
  | "Las Piñas"
  | "Makati"
  | "Marikina"
  | "Muntinlupa"
  | "Navotas"
  | "Parañaque"
  | "Pasay"
  | "Pateros"
  | "Quezon City"
  | "San Juan"
  | "Taguig"
  | "Valenzuela";

type LocType = {
  latitude: number;
  longitude: number;
};

type CarType =
  | "Sedan (4 Door)"
  | "Sedan (2 Door)"
  | "Sports Car"
  | "Station Wagon"
  | "Hatchback"
  | "Convertible"
  | "SUV"
  | "Minivan"
  | "Pickup Truck";

interface CarProp {
  type: CarType;
  id: string;
  plateNumber: string;
}

interface AdditionPrice {
  price: string;
  type: CarType;
}

interface User {
  approved: boolean;
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  photoURL?: string;
  licenseURL?: string;
  privilege: Privilege;
}

interface ShopProps extends User {
  city: NCRCity;
  location: LocType;
  permitURL?: string | undefined;
  shopName: string;
}

interface Service {
  id: string;
  name: string;
  price: string;
  description: string;
  additional: AdditionPrice[];
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
  totalPrice: string;
  timestamp: any;
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
