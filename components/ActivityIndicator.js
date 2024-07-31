import React from "react";
import { ActivityIndicator, Avatar } from "react-native-paper";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { scale, verticalScale } from "react-native-size-matters";
const ActivityIndicatorComp = () => {
  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgb(0, 95, 175)",
        }}
      >
        <Avatar.Icon
          icon={"map-search"}
          size={scale(100)}
          style={{
            backgroundColor: "rgb(0, 95, 175)",
            marginBottom: verticalScale(45),
          }}
          color="#fff"
        />
        <View>
          <ActivityIndicator
            animating={true}
            size={scale(60)}
            color="#fff"
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default ActivityIndicatorComp;
