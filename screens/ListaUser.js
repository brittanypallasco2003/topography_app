import { View, Text, FlatList } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoUser from "../components/InfoUser";
import { LocationContext } from "../context/LocationContext";
import { Button, Searchbar, useTheme } from "react-native-paper";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const ListaUser = () => {
  const { userInfo, setuserInfo } = useContext(LocationContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const usuariosFiltrados = userInfo
    .filter((user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((user) =>
      showInactive ? user.active === false : user.active !== false
    );

  const theme = useTheme();
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: moderateScale(20),
          backgroundColor: theme.colors.background,
        }}
      >
        <Searchbar
          placeholder="Usuario..."
          inputStyle={{ fontFamily: "Poppins_500Medium", fontSize: scale(13) }}
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <View
          style={{
            flexDirection: "row",
            marginVertical: moderateScale(10),
            justifyContent: "center"
          }}
        >
          <Button
            mode={showInactive ? "outlined" : "contained"}
            onPress={() => setShowInactive(false)}
            labelStyle={{fontFamily: "Poppins_500Medium",
              fontSize: scale(12),}}
          >
            Activos
          </Button>
          <Button
          labelStyle={{fontFamily: "Poppins_500Medium",
            fontSize: scale(12),}}
            mode={showInactive ? "contained" : "outlined"}
            onPress={() => setShowInactive(true)}
            style={{ marginLeft: moderateScale(10) }}
          >
            Inactivos
          </Button>
        </View>
        <FlatList
          data={usuariosFiltrados}
          renderItem={({ item }) => {
            return <InfoUser item={item} />;
          }}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </>
  );
};

export default ListaUser;
