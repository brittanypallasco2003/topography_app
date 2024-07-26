import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../utils/firebaseConfig";
import * as turf from "@turf/turf";
import * as Location from "expo-location";
import { LocationContext } from "../context/LocationContext";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "background-location-task";

const UserId = () => {
  const user = auth.currentUser;
  if (user && user.uid) {
    return user.uid;
  } else {
    Alert.alert("No hay usuario conectado");
    return null;
  }
};

const calcularAreaTurf = (locations) => {
  const coordinates = locations.map((loc) => [
    loc.coords.longitude,
    loc.coords.latitude,
  ]);
  coordinates.push(coordinates[0]);
  const polygon = turf.polygon([coordinates]);
  const area = turf.area(polygon);
  return area;
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    const userId = UserId();
    const nuevaUbicacion = locations[0];

    if (userId && nuevaUbicacion) {
      try {
        await setDoc(
          doc(db, "locations", userId),
          {
            userId,
            coords: nuevaUbicacion.coords,
            timestamp: new Date(),
          },
          { merge: true }
        );

        setLocation(nuevaUbicacion);
        setLocations([nuevaUbicacion]);
      } catch (error) {
        console.error("Error actualizando la ubicación: ", error);
      }
    }
  }
});

const MapScreen = () => {
  const { setLocation, locations, setLocations } = useContext(LocationContext);
  const [userId, setUserId] = useState(UserId());
  const [initialRegion, setInitialRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    } else {
      Alert.alert("No hay usuario conectado");
      return;
    }

    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso para acceder a la ubicación denegado");
          return;
        }

        let { status: bgStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (bgStatus !== "granted") {
          Alert.alert(
            "Permiso para acceder a la ubicación en segundo plano denegado"
          );
          return;
        }

        const ubicacionInicial = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        setLocation(ubicacionInicial);
        setInitialRegion({
          latitude: ubicacionInicial.coords.latitude,
          longitude: ubicacionInicial.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setLoading(false);

        await setDoc(
          doc(db, "locations", userId),
          {
            userId,
            coords: ubicacionInicial.coords,
            timestamp: new Date(),
          },
          { merge: true }
        );

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 10,
          timeInterval: 10000,
          deferredUpdatesInterval: 1000,
          showsBackgroundLocationIndicator: true,
        });
      } catch (error) {
        console.error("Error en la configuración de ubicación: ", error);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "locations", userId), (doc) => {
      if (doc.exists) {
        const nuevaUbicacion = doc.data();
        setLocation(nuevaUbicacion);
        setLocations([nuevaUbicacion]);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const actualizarUbicacion = async () => {
    try {
      const nuevaUbicacion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      await setDoc(
        doc(db, "locations", userId),
        {
          userId,
          coords: nuevaUbicacion.coords,
          timestamp: new Date(),
        },
        { merge: true }
      );

      setLocation(nuevaUbicacion);
      setLocations([nuevaUbicacion]);
    } catch (error) {
      console.error("Error actualizando la ubicación manualmente: ", error);
    }
  };

  const handlePolygonPress = () => {
    const area = calcularAreaTurf(locations);
    Alert.alert(
      `Área del Polígono`,
      `El área del polígono es ${area.toFixed(2)} metros cuadrados.`
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView style={styles.map} initialRegion={initialRegion}>
          {locations.map((loc, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              }}
              title={`Usuario: ${loc.userId}`}
            />
          ))}
          {locations.length >= 3 && (
            <Polygon
              coordinates={locations.map((loc) => ({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              }))}
              fillColor="rgba(0, 200, 0, 0.5)"
              strokeColor="rgba(0,0,0,0.5)"
            />
          )}
        </MapView>
      )}
      {locations.length >= 3 && (
        <Button
          title="Formar Polígono y Calcular Área"
          onPress={handlePolygonPress}
        />
      )}
      <Button title="Actualizar Ubicación" onPress={actualizarUbicacion} />
      <Text style={styles.locationCount}>
        Número de ubicaciones: {locations.length}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  locationCount: {
    textAlign: "center",
    padding: 10,
    fontSize: 16,
  },
});

export default MapScreen;
