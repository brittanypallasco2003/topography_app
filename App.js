import { StatusBar } from "expo-status-bar";
import AppNav from "./navigation/AppNav";
import { LocationProvider } from "./context/LocationContext";

const App = () => {
  return (
    <>
      <StatusBar style="auto" />
      <LocationProvider>
        <AppNav />
      </LocationProvider>
    </>
  );
};

export default App;
