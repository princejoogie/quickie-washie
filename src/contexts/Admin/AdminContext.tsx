import React, { createContext, useEffect, useState } from "react";
import { db, firebase } from "../../lib/firebase";
import { Privilege } from "../../types/data-types";

interface Ret {
  approvedShops: firebase.firestore.DocumentData[];
  pendingShops: firebase.firestore.DocumentData[];
  nCustomer: number;
  nOwner: number;
  nAdmin: number;
}

export const AdminContext = createContext<Ret>({
  approvedShops: [],
  pendingShops: [],
  nCustomer: 0,
  nOwner: 0,
  nAdmin: 0,
});

export const AdminProvider: React.FC = ({ children }) => {
  const [nCustomer, setNCustomer] = useState(0);
  const [nOwner, setNOwner] = useState(0);
  const [nAdmin, setNAdmin] = useState(0);
  const [approvedShops, setApprovedShops] = useState<
    firebase.firestore.DocumentData[]
  >([]);
  const [pendingShops, setPendingShops] = useState<
    firebase.firestore.DocumentData[]
  >([]);

  useEffect(() => {
    const _approvedShopSubscriber = db
      .collection("users")
      .where("privilege", "==", "CARWASH_OWNER")
      .where("approved", "==", true)
      .onSnapshot((snapshot) => {
        setApprovedShops(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });

    const _pendingShopSubscriber = db
      .collection("users")
      .where("privilege", "==", "CARWASH_OWNER")
      .where("approved", "==", false)
      .onSnapshot((snapshot) => {
        setPendingShops(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });

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
      _approvedShopSubscriber();
      _pendingShopSubscriber();
      _customerSub();
      _ownerSub();
      _adminSub();
    };
  }, []);

  return (
    <AdminContext.Provider
      value={{ approvedShops, pendingShops, nCustomer, nOwner, nAdmin }}
    >
      {children}
    </AdminContext.Provider>
  );
};
