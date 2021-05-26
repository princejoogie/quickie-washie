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
