import { View, Text, FlatList } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoUser from "../components/InfoUser";
import { LocationContext } from "../context/LocationContext";
import { Searchbar, useTheme } from "react-native-paper";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const ListaUser = () => {
  const { userInfo, setuserInfo } = useContext(LocationContext);
  const [searchQuery, setSearchQuery] = useState("");

  const usuariosFiltrados = userInfo
    .filter((user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.active === false && b.active !== false) return 1;
      if (a.active !== false && b.active === false) return -1;
      return 0;
    });

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
