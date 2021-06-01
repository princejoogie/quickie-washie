import React, { createContext, useEffect, useState } from "react";
import { auth, db, firebase } from "../lib/firebase";
import { Privilege } from "../types/data-types";

interface Ret {
  user: firebase.User | null;
  data: firebase.firestore.DocumentData | undefined;
  privilege: Privilege;
  loading: boolean;
}

export const DatabaseContext = createContext<Ret>({
  user: null,
  data: undefined,
  privilege: "USER",
  loading: true,
});

export const DatabaseProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [privilege, setPrivilege] = useState<Privilege>("USER");
  const [data, setData] =
    useState<firebase.firestore.DocumentData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authSubscriber = auth.onAuthStateChanged((user) => {
      setLoading(() => true);
      setUser(user);
      if (!user) {
        setData(undefined);
        setPrivilege("USER");
        setLoading(() => false);
      }
    });

    return () => {
      authSubscriber();
    };
  }, []);

  useEffect(() => {
    let dataSub = () => {};

    if (user) {
      setLoading(() => true);
      dataSub = db
        .collection("users")
        .doc(user.uid)
        .onSnapshot((res) => {
          const _data = res.data();
          const _privilege = _data?.privilege ?? "USER";

          setData({ id: res.id, ..._data });
          setPrivilege(_privilege);
          setLoading(() => false);
        });
    }

    return () => {
      dataSub();
    };
  }, [user]);

  return (
    <DatabaseContext.Provider value={{ user, data, privilege, loading }}>
      {children}
    </DatabaseContext.Provider>
  );
};
