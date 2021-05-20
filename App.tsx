import "react-native-gesture-handler";
import React from "react";
import { DatabaseProvider } from "./src/contexts/DatabaseContext";
import { AdminProvider } from "./src/contexts/Admin/AdminContext";
import Wrapper from "./src/pages/Wrapper";

const App: React.FC = () => {
  return (
    <DatabaseProvider>
      <AdminProvider>
        <Wrapper />
      </AdminProvider>
    </DatabaseProvider>
  );
};

export default App;
