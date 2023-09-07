import { StyleSheet, Image, View } from "react-native";
import React from "react";

export default function LogoComponent() {
  return (
    <View>
      <Image
        source={require("../assets/airbnb-logo.jpg")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});
