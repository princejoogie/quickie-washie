import { DAYS, MONTHS } from "../constants";
import { AdditionPrice, CarType, LocType, Service } from "../types/data-types";

export const getLocDistance = (loc1: LocType, loc2: LocType) => {
  var R = 6371;
  var dLat = deg2rad(loc2.latitude - loc1.latitude);
  var dLon = deg2rad(loc2.longitude - loc1.longitude);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(loc1.latitude)) *
      Math.cos(deg2rad(loc2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export const formatTime = (time: any) => {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    time = time.slice(1);
    time[5] = +time[0] < 12 ? "AM" : "PM";
    time[0] = +time[0] % 12 || 12;
  }

  time.splice(3, 2);
  return time.join("");
};

export const formatAppointmentDate = (date: Date, time: Date) => {
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${
    MONTHS[date.getMonth()]
  } ${date.getFullYear()} at ${formatTime(time.toLocaleTimeString())}`;
};

export const getAdditional = (
  additional: AdditionPrice[],
  type: CarType
): string => {
  const item = additional.find((el) => el.type === type);
  return item?.price ?? "0";
};

export const getTotalPrice = (service: Service, type: CarType): string => {
  const addition = +getAdditional(service.additional, type);
  const basePrice = +service.price;
  return (addition + basePrice).toString();
};

export const getTimeDiff = (a: Date, b: Date): number | null => {
  return (b.getTime() - a.getTime()) / 1000;
};

export const formatSeconds = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  if (s <= 59 && m <= 0)
    return s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

  const hDisplay = h > 0 ? h + (h == 1 ? " hour, and " : " hours, and ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
  return hDisplay + mDisplay;
};
