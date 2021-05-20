import React, { createContext, useEffect, useState } from "react";
import { auth, db, firebase } from "../lib/firebase";
import { Privilege } from "../types/data-types";

interface Ret {
  user: firebase.User | null;
  data: firebase.firestore.DocumentData | undefined;
  privilege: Privilege;
}

export const DatabaseContext = createContext<Ret>({
  user: null,
  data: undefined,
  privilege: "USER",
});

export const DatabaseProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [privilege, setPrivilege] = useState<Privilege>("USER");
  const [data, setData] =
    useState<firebase.firestore.DocumentData | undefined>(undefined);

  useEffect(() => {
    const authSubscriber = auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection("users")
          .doc(user.uid)
          .onSnapshot((res) => {
            const _data = res.data();
            const _privilege = _data?.privilege as Privilege;

            setData(_data);
            setPrivilege(_privilege);
            setUser(user);
          });
      } else setUser(user);
    });

    return () => {
      authSubscriber();
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ user, data, privilege }}>
      {children}
    </DatabaseContext.Provider>
  );
};
