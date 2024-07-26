import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import MapView from "react-native-maps";

const AdminHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mapContainer} onLongPress={() => navigation.navigate("Map")}>
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
      <Button mode="contained" onPress={() => navigation.navigate("Map")}>
        Visualizar mapa
      </Button>
      <Text>Administrar usuarios</Text>
      <Button mode="contained" onPress={() => navigation.navigate("CrearUser")}>
        Crear usuarios
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate("ListaUser")}>
        Eliminar usuarios
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate("ListaUser")}>
        Desactivar usuarios
      </Button>
    </View>
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
});

export default AdminHome;
