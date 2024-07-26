import React, { useState } from "react";
import { View, Button, Text, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { IconButton, TextInput } from "react-native-paper";


const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [mostrarPassword, setmostrarPassword] = useState(false);
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login Successful");
      // Navigate to the next screen after successful login
      navigation.navigate("Home");
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
