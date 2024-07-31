import { View, Text } from "react-native";
import React from "react";
import AdminHome from "../screens/AdminHome";
import ListaUser from "../screens/ListaUser";
import CrearUser from "../screens/CrearUser";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppBar from "../components/AppBar";

const Stack = createNativeStackNavigator();
const AdminStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="AdminHome"
      screenOptions={{
        header: (props) => <AppBar {...props} />,
      }}
    >
      <Stack.Screen
        name="AdminHome"
        component={AdminHome}
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="CrearUser"
        component={CrearUser}
        options={{
          title: "Agregar Usuario",
        }}
      />
      <Stack.Screen name="ListaUser" component={ListaUser} 
      options={{
        title:"Lista de Usuarios"
      }}/>
    </Stack.Navigator>
  );
};

export default AdminStack;
