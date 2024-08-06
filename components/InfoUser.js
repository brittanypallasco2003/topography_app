import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useContext } from "react";
import { moderateScale, scale } from "react-native-size-matters";
import { IconButton, List, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LocationContext } from "../context/LocationContext";

const InfoUser = ({ item }) => {
  const theme = useTheme();
  const { email, role, key } = item;
  const navigation = useNavigation();
  const { deleteUser } = useContext(LocationContext);

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar este usuario?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteUser(key);
              Alert.alert(
                "Eliminación exitosa",
                `El usuario ${email} fue eliminado`
              );
              navigation.navigate("AdminHome");
            } catch (error) {
              Alert.alert("Eliminación fallida", error.message);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <List.Section>
        <List.Item
          title={`${email}`}
          description={`${role}`}
          style={{ borderBottomWidth: moderateScale(1) }}
          titleStyle={style.titleStListItem}
          descriptionStyle={style.descripListItem}
          right={() => (
            <>
              <IconButton
                icon="delete"
                iconColor={theme.colors.error}
                size={scale(20)}
                onPress={handleDelete}
              />
              <IconButton
                icon="account-off"
                iconColor={theme.colors.primary}
                size={scale(20)}
                onPress={() => {}}
              />
            </>
          )}
        />
      </List.Section>
    </>
  );
};

const style = StyleSheet.create({
  titleStListItem: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: scale(12.5),
  },
  descripListItem: {
    fontFamily: "Poppins_500Medium",
    fontSize: scale(11),
  },
});

export default InfoUser;
