import React, { createContext, useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [userInfo, setuserInfo] = useState([]);
  const [cerrarSesionUser, setcerrarSesionUser] = useState(false)
  const [cerrarSesionAdmin, setcerrarSesionAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
      const usersArray = [];
      querySnapshot.forEach((doc) => {
        usersArray.push({
          ...doc.data(),
          key: doc.id,
        });
      });
      setuserInfo(usersArray);
      console.log("info user", setuserInfo);
    });

    return () => unsubscribe();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const deactivateUser = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { active: false });
    } catch (error) {
      console.error("Error deactivating user: ", error);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        locations,
        setLocations,
        userInfo,
        setuserInfo,
        deleteUser,
        deactivateUser,
        cerrarSesionUser,
        setcerrarSesionUser,
        cerrarSesionAdmin,
        setcerrarSesionAdmin
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
