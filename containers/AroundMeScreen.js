import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

// api
import apiClient from "../api/client";

const userLocation = { latitude: 48.84194, longitude: 2.355 };

const AroundMeScreen = ({ navigation }) => {
  const [coords, setCoords] = useState({});
  const [error, setError] = useState(false);
  const [roomLocations, setRoomLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [finishedLoading, setFinishedLoading] = useState(false);

  useEffect(() => {
    const askLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        setCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setFinishedLoading(true);
      } else {
        setCoords({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        });
        setError(true);
        setFinishedLoading(true);
        // alert("Access to location was denied !");
      }
      setIsLoading(false);
    };

    askLocationPermission();
  }, []);

  useEffect(() => {
    const fecthLocations = async () => {
      try {
        if (error === false) {
          const response = await apiClient.get(
            `/rooms/around?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`
          );
          setRoomLocations(response.data);
          setFinishedLoading(true);
        } else {
          // permission not granted -> dislay all rooms
          const response = await apiClient.get(`/rooms`);
          setRoomLocations(response.data);
          setFinishedLoading(true);
        }
      } catch (error) {
        console.log(error.response);
      }
    };

    if (!isLoading && coords.latitude && coords.longitude) {
      fecthLocations();
    }
  }, [coords, isLoading, error]);

  return !finishedLoading ? (
    <ActivityIndicator />
  ) : (
    // error ? (
    //   <View style={styles.msgContainer}>
    //     <Text style={styles.msg}>Access permission to location denied</Text>
    //     <Text style={styles.subMsg}> Users' locations not available</Text>
    //   </View>
    // ) :
    <MapView
      style={styles.map}
      initialRegion={{
        // latitude: userLocation.latitude,
        // longitude: userLocation.longitude,
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.8,
        longitudeDelta: 0.8,
      }}
      showsUserLocation
    >
      {roomLocations.map((location) => {
        // console.log(location._id);

        return (
          <TouchableOpacity key={location._id}>
            <Marker
              coordinate={{
                latitude: location.location[1],
                longitude: location.location[0],
              }}
              title={location.title}
              onPress={() => {
                navigation.navigate("RoomAround", { id: location._id });
              }}
            />
          </TouchableOpacity>
        );
      })}
    </MapView>
  );
};

export default AroundMeScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  msgContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  msg: {
    textAlign: "center",
    fontSize: 20,
    color: "red",
  },
  subMsg: {
    fontSize: 18,
  },
});
