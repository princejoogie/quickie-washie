import "react-native-gesture-handler";
import React from "react";
import { DatabaseProvider } from "./src/contexts/DatabaseContext";
import Wrapper from "./src/pages/Wrapper";

const App: React.FC = () => {
  return (
    <DatabaseProvider>
      <Wrapper />
    </DatabaseProvider>
  );
};

export default App;
