import { Appbar } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { scale } from "react-native-size-matters";

export default function AppBar({ route, options, navigation, back, isDarkTheme, changeTheme }) {
  const title = getHeaderTitle(options, route.name);
  return (
    <Appbar.Header elevated={true} mode="center-aligned">
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content
        title={title}
        titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: scale(17) }}
      />
      <Appbar.Action icon='brightness-4' onPress={() => changeTheme()}/>
    </Appbar.Header>
  );
}
