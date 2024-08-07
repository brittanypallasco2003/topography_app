import { Appbar } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { scale } from "react-native-size-matters";
import { useContext } from "react";
import { LocationContext } from "../context/LocationContext";

export default function AppBar({
  route,
  options,
  navigation,
  back,
  isDarkTheme,
  changeTheme,
  isHomeAdmin,
  isHomeUser,
}) {
  const { cerrarSesionAdmin, cerrarSesionUser } = useContext(LocationContext);
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header elevated={true} mode="center-aligned">
      {back && !isHomeAdmin && !cerrarSesionUser ? (
        <Appbar.BackAction onPress={navigation.goBack} />
      ) : isHomeAdmin ? (
        <Appbar.Action
          icon="logout"
          onPress={() => navigation.navigate("Login")}
        />
      ) : null}

      {cerrarSesionUser && isHomeUser && (
        <Appbar.Action
          icon="logout"
          onPress={() => navigation.navigate("Login")}
        />
      )}

      <Appbar.Content
        title={title}
        titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: scale(17) }}
      />
      <Appbar.Action icon="brightness-4" onPress={() => changeTheme()} />
    </Appbar.Header>
  );
}
