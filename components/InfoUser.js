import { View, Text } from "react-native";
import React, { useContext } from "react";


const InfoUser = ({ item }) => {

  return (
    <View
      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
    >
      <Text>Email: {item.email}</Text>
      <Text>Role: {item.role}</Text>
    </View>
  );
};

export default InfoUser;
