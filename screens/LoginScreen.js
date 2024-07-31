import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Image } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Button, TextInput, useTheme } from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";
import { scale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityIndicatorComp from "../components/ActivityIndicator";
import Loading from "../components/Loading";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setmostrarPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const navigation = useNavigation();

  const theme = useTheme();
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
      }finally{
        setloading(false)
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={styles.title}>Topography App</Text>
        <Avatar.Icon icon={"map-search"} size={300} />
        <Loading loading={loading}/>
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
        <TextInput
          contentStyle={styles.input}
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
        <Button
          labelStyle={styles.buttonText}
          mode="elevated"
          textColor="#fff"
          buttonColor={theme.colors.primary}
          onPress={() => {
            handleLogin();
            setloading(true);
          }}
        >
          Iniciar Sesión
        </Button>
        <Button
          textColor="#fff"
          buttonColor={theme.colors.primary}
          mode="elevated"
          onPress={() => {
            handleNavigateToRegister();
          }}
        >
          Registro
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: scale(22),
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    height: 100,
    aspectRatio: 1,
  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: scale(12),
  },
  input: {
    fontFamily: "Poppins_500Medium",
    fontSize: scale(11),
  },
});

export default LoginScreen;
