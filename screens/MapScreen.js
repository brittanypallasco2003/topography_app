import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore"; 
import { db } from '../utils/firebaseConfig';
import * as turf from '@turf/turf';
import { getCurrentLocation, watchLocation } from '../services/location';

const generateRandomUserId = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

const calculateAreaTurf = (locations) => {
  const coordinates = locations.map(loc => [loc.coords.longitude, loc.coords.latitude]);
  coordinates.push(coordinates[0]);
  const polygon = turf.polygon([coordinates]);
  const area = turf.area(polygon);
  return area;
};

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [userId, setUserId] = useState(generateRandomUserId);

  useEffect(() => {
    (async () => {
      try {
        let initialLocation = await getCurrentLocation();
        setLocation(initialLocation);

        // Enviar la ubicación inicial a Firestore
        await setDoc(doc(db, "locations", userId), {
          coords: initialLocation.coords,
          timestamp: new Date(),
        });

        // Watch the location and update Firestore on location change
        await watchLocation(async (newLocation, distanceThreshold) => {
          if (location) {
            const distance = turf.distance(
              [location.coords.longitude, location.coords.latitude],
              [newLocation.coords.longitude, newLocation.coords.latitude],
              { units: 'meters' }
            );

            if (distance > distanceThreshold) {
              setLocation(newLocation);

              // Actualizar la ubicación en Firestore
              await setDoc(doc(db, "locations", userId), {
                coords: newLocation.coords,
                timestamp: new Date(),
              });
            }
          } else {
            setLocation(newLocation);
          }
        });
      } catch (error) {
        console.error("Error in location setup: ", error);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "locations"), (snapshot) => {
      const locs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocations(locs);
    });

    return () => unsubscribe();
  }, []);

  const handlePolygonPress = () => {
    const area = calculateAreaTurf(locations);
    Alert.alert(`Área del Polígono`, `El área del polígono es ${area.toFixed(2)} metros cuadrados.`);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location ? location.coords.latitude : 0,
          longitude: location ? location.coords.longitude : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {locations.map(loc => (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            }}
            title={`User: ${loc.id}`}
          />
        ))}
        {locations.length >= 3 && (
          <Polygon
            coordinates={locations.map(loc => ({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            }))}
            fillColor="rgba(0, 200, 0, 0.5)"
            strokeColor="rgba(0,0,0,0.5)"
          />
        )}
      </MapView>
      {locations.length >= 3 && (
        <Button title="Formar Polígono y Calcular Área" onPress={handlePolygonPress} />
      )}
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
});

export default MapScreen;
