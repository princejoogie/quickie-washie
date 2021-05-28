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
  | "Pateros"
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
