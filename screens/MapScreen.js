import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore"; 
import { db, auth } from '../utils/firebaseConfig';
import * as turf from '@turf/turf';
import { getCurrentLocation, watchLocation } from '../services/location';

const UserId = () => {
  const user = auth.currentUser;
  if (user && user.uid) {
    return user.uid;
  } else {
    Alert.alert('No user logged in');
    return;
  }
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
  const [userId, setUserId] = useState(UserId);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid); // Usa el ID del usuario autenticado
    } else {
      Alert.alert('No user logged in');
      return;
    }
    (async () => {
      try {
        let initialLocation = await getCurrentLocation();
        setLocation(initialLocation);
        setRegion({
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setLoading(false);

        await setDoc(doc(db, "locations", userId), {
          coords: initialLocation.coords,
          timestamp: new Date(),
        });

        await watchLocation(async (newLocation, distanceThreshold) => {
          if (location) {
            const distance = turf.distance(
              [location.coords.longitude, location.coords.latitude],
              [newLocation.coords.longitude, newLocation.coords.latitude],
              { units: 'meters' }
            );

            if (distance > distanceThreshold) {
              setLocation(newLocation);
              setRegion({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });

              // Actualizar la ubicación en Firestore
              await setDoc(doc(db, "locations", userId), {
                coords: newLocation.coords,
                timestamp: new Date(),
              });
            }
          } else {
            setLocation(newLocation);
            setRegion({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        });
      } catch (error) {
        console.error("Error in location setup: ", error);
        setLoading(false);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          region={region}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
          )}
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
      )}
      {locations.length >= 3 && (
        <Button title="Formar Polígono y Calcular Área" onPress={handlePolygonPress} />
      )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
