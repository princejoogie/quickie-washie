export type Privilege = "ADMIN" | "USER" | "CARWASH_OWNER";

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

interface ShopProps {
  id: string;
  city:
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
  email: string;
  fullName: string;
  location: LocType;
  phoneNumber: string;
  permitURL?: string | undefined;
  photoURL?: string | undefined;
  shopName: string;
}
