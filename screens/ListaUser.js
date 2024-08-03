import { View, Text, FlatList } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoUser from "../components/InfoUser";
import { LocationContext } from "../context/LocationContext";
import { Searchbar } from "react-native-paper";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const ListaUser = () => {
  const { userInfo, setuserInfo } = useContext(LocationContext);
  const [searchQuery, setSearchQuery] = useState("");
  const usuariosFiltrados = userInfo.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: moderateScale(20) }}>
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
