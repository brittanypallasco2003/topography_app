import React, { createContext, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locations, setLocations] = useState([]);

  return (
    <LocationContext.Provider
      value={{ location, setLocation, locations, setLocations }}
    >
      {children}
    </LocationContext.Provider>
  );
};
