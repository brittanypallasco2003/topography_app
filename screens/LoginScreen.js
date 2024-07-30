import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Image } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Button, TextInput } from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setmostrarPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Obtener el rol del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "admin") {
          Alert.alert("Bienvenido, Admin!");
          navigation.navigate("AdminStack");
        } else {
          Alert.alert("Bienvenido, Usuario!");
          navigation.navigate("Home");
        }
      } else {
        Alert.alert("No user data found");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Topography App</Text>
      <Avatar.Image size={300} source={require("../assets/image1.png")} 
      style={{backgroundColor:"rgb(240, 219, 255)"}}/>
      <TextInput
        mode="outlined"
        placeholder="Correo Eléctrónico"
        value={email}
        onChangeText={(texto) => {
          setEmail(texto);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        secureTextEntry={!mostrarPassword}
        placeholder="Contraseña"
        mode="outlined"
        onChangeText={(texto) => setPassword(texto)}
        value={password}
        right={
          <TextInput.Icon
            icon={mostrarPassword ? "eye" : "eye-off"}
            size={20}
            iconColor="#000"
            rippleColor={"#000"}
            onPress={() => setmostrarPassword(!mostrarPassword)}
          />
        }
      />
      <Button mode="elevated" onPress={() => handleLogin()}>
        Iniciar Sesión
      </Button>
      <Button
        mode="elevated"
        onPress={() => {
          handleNavigateToRegister();
        }}
      >
        Registro
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    height: 100,
    aspectRatio: 1,
  },
});

export default LoginScreen;
