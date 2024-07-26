import React, { useState } from "react";
import { View, Button, Text, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { IconButton, TextInput } from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setmostrarPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener el rol del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          Alert.alert("Login Successful", "Welcome, Admin!");
          navigation.navigate("AdminStack"); 
        } else {
          Alert.alert("Login Successful", "Welcome, User!");
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
      <TextInput
        mode="outlined"
        placeholder="Email"
        value={email}
        onChangeText={(texto) => { setEmail(texto) }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        secureTextEntry={!mostrarPassword}
        placeholder="Contraseña"
        mode='outlined'
        onChangeText={(texto) => setPassword(texto)}
        value={password}
        right={<TextInput.Icon
          icon={mostrarPassword ? "eye" : "eye-off"}
          size={15}
          iconColor="#000"
          rippleColor={"#000"}
          onPress={() => setmostrarPassword(!mostrarPassword)}
        />}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={handleNavigateToRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;
