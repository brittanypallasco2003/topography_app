import { View, Text, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { moderateScale, scale } from "react-native-size-matters";
import { IconButton, List, useTheme } from "react-native-paper";

const InfoUser = ({ item }) => {
  const theme = useTheme();
  const { email, role } = item;

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
                size={scale(18)}
                onPress={() => {}}
              />
              {/* <IconButton  //te dejo esto por si quieres poner mejor una sola vista para eliminar y desactivar usuarios
                icon="account-off"
                iconColor={theme.colors.primary}
                size={scale(18)}
                onPress={() => {}}
              /> */}
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
