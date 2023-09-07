import React, { Component } from "react";
import { AppRegistry, Image, StyleSheet, Text, View } from "react-native";

import Swiper from "react-native-swiper";

export default class SwiperComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Swiper
        style={styles.wrapper}
        showsButtons={true}
        height={500}
        buttonWrapperStyle={{ height: "100%", top: 0, position: "absolute" }}
        showsPagination={true}
        paginationStyle={{ top: 200, gap: 15 }}
        dotStyle={{ width: 15, height: 15, borderRadius: 7.5 }}
        activeDotStyle={{ width: 15, height: 15, borderRadius: 7.5 }}
        activeDotColor="white"
        dotColor="gray"
        loadMinimal={true}
      >
        {this.props.data.photos.map((image, index) => {
          return (
            <View style={styles.slide1} key={index}>
              <Image source={{ uri: image.url }} style={styles.img} />
            </View>
          );
        })}
      </Swiper>
    );
  }
}

AppRegistry.registerComponent("myproject", () => SwiperComponent);

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    // backgroundColor: "#9DD6EB",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    // borderColor: "red",
    // borderWidth: 2,
  },
});
