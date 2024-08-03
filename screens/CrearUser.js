import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { Button, Divider, Menu, TextInput } from "react-native-paper";
import { scale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const navigation = useNavigation();

  const generatePassword = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };

  const sendEmail = async (to, subject, text, html) => {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SENDGRID_API_KEY}`, // Replace with your SendGrid API Key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
            },
          ],
          from: { email: 'davidvallejo080808@gmail.com' },
          subject: subject,
          content: [
            {
              type: 'text/plain',
              value: text,
            },
            {
              type: 'text/html',
              value: html,
            },
          ],
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      console.log("Email sent");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleRegister = async () => {
    const password = generatePassword();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
        name: name,
        apellido: apellido,
        telefono: telefono,
      });

      await sendEmail(
        email,
        'Welcome to our service!',
        `Your password is ${password}`,
        `<strong>Your password is ${password}</strong>`
      );

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
            onChangeText={(texto) => setName(texto)}
          />
          <TextInput
            mode="outlined"
            contentStyle={styles.input}
            placeholder="Apellido"
            value={apellido}
            onChangeText={(texto) => setApellido(texto)}
          />
          <TextInput
            mode="outlined"
            contentStyle={styles.input}
            placeholder="Número de teléfono"
            value={telefono}
            onChangeText={(texto) => setTelefono(texto)}
          />
          <TextInput
            mode="outlined"
            contentStyle={styles.input}
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={(texto) => setEmail(texto)}
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
          <Button mode="contained" onPress={handleRegister}>
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
