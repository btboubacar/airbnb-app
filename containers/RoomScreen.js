import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import MapView, { Marker } from "react-native-maps";

// components
import Stars from "../components/Stars";
import SwiperComponent from "../components/SwiperComponent";

// api client
import apiClient from "../api/client";
const endpoint = "/rooms";

export default function RoomScreen() {
  const route = useRoute();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isExpended, setIsExpended] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${endpoint}/${route.params.id}`);

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
      <View style={styles.offerBloc}>
        <View style={styles.imgBloc}>
          <SwiperComponent data={data} />
        </View>

        <View style={styles.infos}>
          <View style={styles.infosText}>
            <Text style={styles.title} numberOfLines={1}>
              {data.title}
            </Text>

            <View style={styles.priceBloc}>
              <Text style={styles.price}>{data.price} €</Text>
            </View>
            <View style={styles.ratings}>
              <Stars ratingValue={data.ratingValue} size={20} />
              <Text style={styles.review}>{data.reviews} reviews</Text>
            </View>
          </View>
          <Image
            source={{ uri: data.user.account.photo.url }}
            style={styles.userImg}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description} numberOfLines={isExpended ? 0 : 3}>
            {data.description}
          </Text>
          <TouchableOpacity onPress={() => setIsExpended(!isExpended)}>
            {isExpended ? (
              <Text style={styles.moreLess}>
                Show less{" "}
                <Octicons
                  name="triangle-up"
                  size={22}
                  color="black"
                  style={styles.icon}
                />
              </Text>
            ) : (
              <Text style={styles.moreLess}>
                Show more{" "}
                <Octicons
                  name="triangle-down"
                  size={22}
                  color="black"
                  style={styles.icon}
                />
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: data.location[1],
          longitude: data.location[0],
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: data.location[1],
            longitude: data.location[0],
          }}
          title={data.user.account.username}
          description={data.title}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "white",
    alignItems: "center",
    flex: 1,
  },

  offerBloc: {
    // width: "100%",
    position: "relative",
  },

  imgBloc: {
    marginTop: -20,
    height: 220,
    width: "100%",
    // borderColor: "red",
    // borderWidth: 2,
  },

  infos: {
    padding: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userImg: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 40,
    marginRight: 15,
  },
  infosText: {
    flex: 1,
    gap: 20,
  },
  title: {
    fontSize: 18,
    color: "#282828",
    paddingLeft: 15,
  },
  priceBloc: {
    backgroundColor: "black",
    position: "absolute",
    top: -70,
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
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  review: {
    color: "#BBBBBB",
  },
  descriptionContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  description: {
    textAlign: "justify",
    paddingBottom: 5,
  },
  moreLess: {
    justifyContent: "center",
    fontSize: 15,
  },

  map: {
    width: "100%",
    height: 400,
  },
});
