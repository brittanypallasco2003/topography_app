import React, { useContext } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Modal, Portal, ActivityIndicator, useTheme } from "react-native-paper";

import { moderateScale, scale } from "react-native-size-matters";

const Loading = (props) => {
  const theme=useTheme();
  return (
    <Portal>
      <Modal
        visible={props.loading}
        contentContainerStyle={styles.modalContainer}
      >
        <ActivityIndicator
          animating={true}
          size={scale(40)}
        />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    padding: moderateScale(30),
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
  },
});

export default Loading;
