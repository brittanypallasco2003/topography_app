import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../utils/firebaseConfig";
import * as turf from "@turf/turf";
import * as Location from "expo-location";
import { LocationContext } from "../context/LocationContext";
import * as TaskManager from "expo-task-manager";
import { ActivityIndicator, Button, useTheme } from "react-native-paper";
import { moderateScale, scale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "@react-navigation/native";

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

console.log("email" + auth.currentUser?.email);
console.log("email" + auth.currentUser);

const calcularAreaTurf = (locations) => {
  const coordinates = locations.map((loc) => [
    loc.coords?.longitude,
    loc.coords?.latitude,
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
            coords: nuevaUbicacion.coords,
            timestamp: new Date(),
            email: auth.currentUser?.email,
          },
          { merge: true }
        );
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
  const theme = useTheme();
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
          latitude: ubicacionInicial.coords?.latitude,
          longitude: ubicacionInicial.coords?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setLoading(false);

        await setDoc(
          doc(db, "locations", userId),
          {
            coords: ubicacionInicial.coords,
            timestamp: new Date(),
            email: auth.currentUser?.email,
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
    const unsubscribe = onSnapshot(collection(db, "locations"), (snapshot) => {
      const now = new Date();
      const recentLocations = snapshot.docs
        .map((doc) => doc.data())
        .filter((loc) => {
          const lastUpdate = loc.timestamp.toDate(); // Convertir timestamp a objeto Date
          const diffInMinutes = (now - lastUpdate) / (1000 * 60); // Diferencia en minutos
          return diffInMinutes <= 5; // Ajusta el tiempo según sea necesario
        });
      setLocations(recentLocations);
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
          coords: nuevaUbicacion.coords,
          timestamp: new Date(), // Marca de tiempo de la última actualización
          email: auth.currentUser?.email,
        },
        { merge: true }
      );

      setLocation(nuevaUbicacion);
      setLocations((prevLocations) => {
        const newLocations = prevLocations.filter(
          (loc) => loc.userId !== userId
        );
        return [...newLocations, { ...nuevaUbicacion, userId }];
      });
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
      <View style={[styles.loadingContainer,{backgroundColor:theme.colors.background}]}>
        <ActivityIndicator size={scale(40)} />
      </View>
    );
  }

  const colors = [
    "red",
    "blue",
    "green",
    "purple",
    "orange",
    "pink",
    "cyan",
    "magenta",
    "yellow",
    "grey",
  ];

  return (
    <View style={[styles.container,{backgroundColor:theme.colors.background}]}>
      {initialRegion && (
        <MapView style={styles.map} initialRegion={initialRegion}>
          {locations.map((loc, index) => {
            const color = colors[index % colors.length];

            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: loc.coords?.latitude,
                  longitude: loc.coords?.longitude,
                }}
                pinColor={color}
                title={`Usuario: ${loc.email}`}
              />
            );
          })}
          {locations.length >= 3 && (
            <Polygon
              coordinates={locations.map((loc) => ({
                latitude: loc.coords?.latitude,
                longitude: loc.coords?.longitude,
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
      <Button
        style={{ borderRadius: moderateScale(0) }}
        labelStyle={styles.buttonText}
        mode="contained"
        onPress={() => {
          actualizarUbicacion();
        }}
      >
        Actualizar Ubicación
      </Button>
      <Text style={[styles.locationCount, { color: theme.colors.primary }]}>
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
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
    padding: 10,
    fontSize: scale(12),
  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: scale(12),
  },
});

export default MapScreen;
