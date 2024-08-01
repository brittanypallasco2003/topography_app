import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { Button, Divider, Menu, TextInput } from "react-native-paper";
import { scale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [visible, setVisible] = React.useState(false);
  const [name, setname] = useState("");
  const [apellido, setapellido] = useState("");
  const [telefono, settelefono] = useState("");
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
        name: name,
      });

      Alert.alert("Registration Successful");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.contentScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <TextInput
            mode="outlined"
            contentStyle={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={(texto) => {
              setname(texto);
            }}
          />
          <TextInput
            mode="outlined"
            contentStyle={styles.input}
            placeholder="Apellido"
            value={apellido}
            onChangeText={(texto) => {
              setapellido(texto);
            }}
          />
          <TextInput
            mode="outlined"
            contentStyle={styles.input}
            placeholder="Número de teléfono"
            value={telefono}
            onChangeText={(texto) => {
              settelefono(texto);
            }}
          />
          <TextInput
            mode="outlined"
            contentStyle={styles.input}
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={(texto) => {
              setEmail(texto);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View
            style={{
              paddingTop: 30,
              paddingBottom: 50,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
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
                  closeMenu();
                }}
                title="Usuario"
              />
              <Divider />
              <Menu.Item
                onPress={() => {
                  setRole("admin");
                  closeMenu();
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  input: {
    fontFamily: "Poppins_500Medium",
    fontSize: scale(11),
  },
  optionMenu: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  contentScroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

export default RegisterScreen;
