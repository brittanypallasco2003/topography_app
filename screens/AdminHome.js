import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Button, useTheme } from "react-native-paper";
import MapView from "react-native-maps";
import { scale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";


const AdminHome = ({ navigation }) => {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TouchableOpacity
        style={styles.mapContainer}
        onLongPress={() => navigation.navigate("Map")}
      >
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -0.180653,
            longitude: -78.467834,
            longitudeDelta: 0.04,
            latitudeDelta: 0.02,
          }}
        />
      </TouchableOpacity>
      <Button
        mode="contained"
        labelStyle={styles.buttonText}
        onPress={() => navigation.navigate("Map")}
      >
        Visualizar mapa
      </Button>
      <Text style={[styles.title,{color:theme.colors.primary}]}>Administrar usuarios</Text>
      <Button
        mode="contained"
        labelStyle={styles.buttonText}
        onPress={() => navigation.navigate("CrearUser")}
      >
        Crear usuarios
      </Button>
      <Button
        mode="contained"
        labelStyle={styles.buttonText}
        onPress={() => navigation.navigate("ListaUser")}
      >
        Eliminar usuarios
      </Button>
      <Button
        mode="contained"
        labelStyle={styles.buttonText}
        onPress={() => navigation.navigate("ListaUser")}
      >
        Desactivar usuarios
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  mapContainer: {
    height: 200,
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: scale(12),
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: scale(14),
  },
});

export default AdminHome;
