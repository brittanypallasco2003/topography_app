import { View, Text } from "react-native";
import React from "react";
import AdminHome from "../screens/AdminHome";
import ListaUser from "../screens/ListaUser";
import CrearUser from "../screens/CrearUser";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const AdminStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="AdminHome"
    >
      <Stack.Screen name="AdminHome" component={AdminHome} />
      <Stack.Screen name="CrearUser" component={CrearUser} />
      <Stack.Screen name="ListaUser" component={ListaUser} />
    </Stack.Navigator>
  );
};

export default AdminStack;
