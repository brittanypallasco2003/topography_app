import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { moderateScale, scale } from "react-native-size-matters";
import { IconButton, List, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LocationContext } from "../context/LocationContext";
import Loading from "./Loading";

const InfoUser = ({ item }) => {
  const theme = useTheme();
  const { email, role, key, active } = item;
  const { deleteUser, deactivateUser } = useContext(LocationContext);
  const [loading, setloading] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de eliminar este usuario?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            setloading(true);
            try {
              await deleteUser(key);
              Alert.alert(
                "Eliminación exitosa",
                `El usuario ${email} fue eliminado`
              );
            } catch (error) {
              Alert.alert("Eliminación fallida", error.message);
            } finally {
              setloading(false);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeactivate = () => {
    Alert.alert(
      "Confirmar Desactivación",
      "¿Estás seguro de desactivar este usuario?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Desactivar",
          onPress: async () => {
            setloading(true);
            try {
              await deactivateUser(key);
              Alert.alert(
                "Desactivación exitosa",
                `El usuario ${email} fue desactivado`
              );
            } catch (error) {
              Alert.alert("Desactivación fallida", error.message);
            } finally {
              setloading(false);
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
        <Loading loading={loading} />
        <List.Item
          title={`${email}`}
          description={active === false ? "Usuario desactivado" : `${role}`}
          style={[
            { borderBottomWidth: moderateScale(1) },
            active === false && style.inactiveUser,
          ]}
          titleStyle={[
            style.titleStListItem,
            active === false && style.inactiveTitle,
          ]}
          descriptionStyle={[
            style.descripListItem,
            active === false && style.inactiveDescription,
          ]}
          right={() => (
            <>
              <IconButton
                icon="delete"
                iconColor={theme.colors.error}
                size={scale(20)}
                onPress={handleDelete}
              />
              {active != false && (
                <IconButton
                  icon="account-off"
                  iconColor={theme.colors.primary}
                  size={scale(20)}
                  onPress={handleDeactivate}
                />
              )}
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
  inactiveUser: {
    backgroundColor: "#F0F0F0",
  },
  inactiveTitle: {
    color: "#8E8E8E",
  },
  inactiveDescription: {
    color: "#DC7D7E",
  },
});

export default InfoUser;
