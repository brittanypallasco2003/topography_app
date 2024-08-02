import { View, Text, FlatList } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoUser from "../components/InfoUser";
import { LocationContext } from "../context/LocationContext";

const ListaUser = () => {
  const { userInfo, setuserInfo } = useContext(LocationContext);
  return (
    <SafeAreaView style={{flex:1}}>
      <FlatList
      data={userInfo}
      renderItem={({item}) => {
        return <InfoUser item={item}/>
       }}
       keyExtractor={(item) => item.key}
      />

    </SafeAreaView>
  );
};

export default ListaUser;
