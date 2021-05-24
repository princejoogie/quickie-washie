import { LocType } from "../types/data-types";

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
