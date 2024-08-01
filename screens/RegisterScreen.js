import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { Button, Divider, Menu } from "react-native-paper";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Guardar el rol del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
      });

      Alert.alert("Registration Successful");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View
      style={{
        paddingTop:30,
        paddingBottom: 50,
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button mode="elevated" onPress={openMenu}>
              Seleccionar rol
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setRole("usuario");
              closeMenu()
            }}
            title="Usuario"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setRole("admin");
              closeMenu()
            }}
            title="Administrador"
          />
        </Menu>
      </View>
      <Button
        mode="contained"
        onPress={() => {
          handleRegister();
        }}
      >
        Registrar Usuario
      </Button>
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
  optionMenu: {
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export default RegisterScreen;
