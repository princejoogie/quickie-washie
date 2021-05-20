import React, { createContext, useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { Privilege } from "../../types/data-types";

interface Ret {
  nCustomer: number;
  nOwner: number;
  nAdmin: number;
}

export const AdminContext = createContext<Ret>({
  nCustomer: 0,
  nOwner: 0,
  nAdmin: 0,
});

export const AdminProvider: React.FC = ({ children }) => {
  const [nCustomer, setNCustomer] = useState(0);
  const [nOwner, setNOwner] = useState(0);
  const [nAdmin, setNAdmin] = useState(0);

  useEffect(() => {
    const _customerSub = db
      .collection("users")
      .where("privilege", "==", "USER" as Privilege)
      .onSnapshot((snap) => {
        setNCustomer(snap.docs.length);
      });

    const _ownerSub = db
      .collection("users")
      .where("privilege", "==", "CARWASH_OWNER" as Privilege)
      .onSnapshot((snap) => {
        setNOwner(snap.docs.length);
      });

    const _adminSub = db
      .collection("users")
      .where("privilege", "==", "ADMIN" as Privilege)
      .onSnapshot((snap) => {
        setNAdmin(snap.docs.length);
      });

    return () => {
      _customerSub();
      _ownerSub();
      _adminSub();
    };
  }, []);

  return (
    <AdminContext.Provider value={{ nCustomer, nOwner, nAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
