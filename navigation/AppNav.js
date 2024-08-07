import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "../screens/MapScreen";
import LoginScreen from "../screens/LoginScreen";
import AdminStack from "./AdminStack";
import AppBar from "../components/AppBar";

const Stack = createNativeStackNavigator();

const AppNav = ({ isDarkTheme, changeTheme }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={({ route }) => ({
          header: (props) => (
            <AppBar
              {...props}
              isDarkTheme={isDarkTheme}
              changeTheme={changeTheme}
              isHomeUser={route.name === "Map"}
            />
          ),
        })}
      >
        <Stack.Screen name="Login" component={LoginScreen} 
         options={{
          title:''
        }}/>
        <Stack.Screen name="AdminStack" options={{ headerShown: false }}>
          {(props) => (
            <AdminStack
              {...props}
              isDarkTheme={isDarkTheme}
              changeTheme={changeTheme}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Map" component={MapScreen}
        options={{
          title:'Mapa'
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNav;
