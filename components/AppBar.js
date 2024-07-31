import { Appbar } from "react-native-paper";
import { getHeaderTitle } from '@react-navigation/elements';

export default function AppBar({ route, options, navigation, back }) {
  const title = getHeaderTitle(options, route.name);
  return (
    <Appbar.Header
    elevated={true}
    mode='center-aligned'
    >
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}
