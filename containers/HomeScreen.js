import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Constants from "expo-constants";

// components
import Stars from "../components/Stars";

// api client
import apiClient from "../api/client";
const endpoint = "/rooms";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(endpoint);

        // console.log(JSON.stringify(response.data, null, 2));

        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchData();
  }, []);

  return isLoading === true ? (
    <ActivityIndicator animating={isLoading} color="red" size={40} />
  ) : (
    <View style={styles.container}>
      {/* <View style={styles.logoBloc}>
        <Image
          source={require("../assets/airbnb-logo.jpg")}
          style={styles.logo}
        />
      </View> */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.offerBloc}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => {
                navigation.navigate("Room", { id: item._id });
              }}
            >
              <Image
                source={{ uri: item.photos[0].url }}
                style={styles.offerImg}
              />

              <View style={styles.infos}>
                <View style={styles.infosText}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>

                  <View style={styles.priceBloc}>
                    <Text style={styles.price}>{item.price} €</Text>
                  </View>
                  <View style={styles.ratings}>
                    <Stars ratingValue={item.ratingValue} size={20} />
                    <Text style={styles.review}>{item.reviews} reviews</Text>
                  </View>
                </View>
                <Image
                  source={{ uri: item.user.account.photo.url }}
                  style={styles.userImg}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator}></View>}
        style={styles.offersContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "white",
    alignItems: "center",
  },
  // logoBloc: {
  //   borderBottomWidth: 2,
  //   width: "100%",
  //   borderBottomColor: "#E9E9E9",
  //   alignItems: "center",
  //   marginBottom: 10,
  //   paddingBottom: 5,
  // },
  // logo: {
  //   width: 60,
  //   height: 60,
  //   resizeMode: "contain",
  // },

  offersContainer: {
    marginTop: -20,
    // borderColor: "red",
    // borderWidth: 2,
  },
  offerBloc: {
    position: "relative",
  },
  imageContainer: {
    // borderColor: "red",
    // borderWidth: 2,
    width: 350,
    overflow: "hidden",
  },

  offerImg: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 5,
  },
  separator: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#E9E9E9",
    marginBottom: 15,
  },

  infos: {
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userImg: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 40,
  },
  infosText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: "#282828",
  },
  priceBloc: {
    backgroundColor: "black",
    position: "absolute",
    top: -90,
    left: 0,
    width: 80,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  price: {
    color: "white",
    fontSize: 25,
  },

  ratings: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  review: {
    color: "#BBBBBB",
  },
});
