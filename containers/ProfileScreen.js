import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//
import apiClient from "../api/client";

export default function ProfileScreen({ userToken, setToken, userId }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");
  const [firstSubmitted, setFirstSubmitted] = useState(false);
  const [userBody, setUserBody] = useState({});

  const askPermissionAndGetPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const response = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (response.canceled === true) {
        alert("No picture selected");
      } else {
        setAvatar(response.assets[0].uri);
      }
    } else {
      alert("Access to media library permission denied");
    }
  };

  const askPermissionAndTakePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "granted") {
      const response = await ImagePicker.launchCameraAsync();
      if (response.canceled === true) {
        alert("No picture selected");
      } else {
        setAvatar(response.assets[0].uri);
      }
    } else {
      alert("Access to camera permission denied");
    }
  };

  const sendPicture = async () => {
    try {
      const extension = avatar.split(".")[1];
      const formData = new FormData();
      formData.append("photo", {
        name: `image.${extension}`,
        type: `image/${extension}`,
        uri: avatar,
      });
      const response = await apiClient.put("/user/upload_picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      });

      setUserBody({
        avatar: response.data.photo.url,
      });
      alert("Picture successfully sent !");
    } catch (error) {
      console.log(error);
    }
  };

  const sendDetails = async () => {
    const body = {};
    if (email) body.email = email;
    if (username) body.username = username;
    if (description) body.description = description;

    const response = await apiClient.put("/user/update", body, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    setUserBody({
      email: response.data.email,
      username: response.data.username,
      description: response.data.description,
      avatar: response.data.photo.url,
    });
  };
  // -------
  // -------
  const handleUpdate = () => {
    // console.log(email, username, description, avatar);

    if (avatar && (email || username || description)) {
      sendPicture();
      setFirstSubmitted(true);
    } else {
      if (avatar) {
        sendPicture();
      } else {
        sendDetails();
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await apiClient.get(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      // console.log(response.data);
      setEmail(response.data.email);
      setUsername(response.data.username);
      setDescription(response.data.description);
      setAvatar(response.data.photo.url);
    };
    fetchUser();

    if (firstSubmitted) sendDetails();
    setFirstSubmitted(false);
  }, [firstSubmitted, userBody]);
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.userContainer}>
        {avatar ? (
          <>
            <Image source={{ uri: avatar }} style={styles.user} />
            <TouchableOpacity
              style={styles.trashContainer}
              onPress={() => {
                setAvatar("");
              }}
            >
              <Ionicons
                name="md-trash-outline"
                size={24}
                color="black"
                style={styles.trashCan}
              />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.user}>
            <FontAwesome name="user" size={100} color="#E7E7E7" />
          </View>
        )}

        <View style={styles.photoCamera}>
          <TouchableOpacity
            // disabled={avatar ? true : false}
            onPress={askPermissionAndGetPicture}
          >
            <MaterialIcons name="photo-library" size={40} color="#717171" />
          </TouchableOpacity>
          <TouchableOpacity
            // disabled={avatar ? true : false}
            onPress={askPermissionAndTakePicture}
          >
            <MaterialIcons name="camera-alt" size={40} color="#717171" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="email"
          value={email}
          autoCapitalize="none"
          style={styles.input}
          onChangeText={(input) => setEmail(input)}
        />
        <TextInput
          placeholder="username"
          value={username}
          autoCapitalize="none"
          style={styles.input}
          onChangeText={(input) => setUsername(input)}
        />
        <TextInput
          placeholder="description"
          value={description}
          multiline
          style={[styles.input, styles.description]}
          onChangeText={(input) => setDescription(input)}
        />
      </View>

      <View style={styles.topBtnContainer}>
        <TouchableOpacity style={styles.btnContainer}>
          <Text style={styles.btn} onPress={handleUpdate}>
            Update
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnContainer, styles.logout]}>
          <Text
            style={styles.btn}
            onPress={() => {
              setToken(null);
            }}
          >
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingTop: 30,
  },
  user: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: "#FFCED2",
    borderWidth: 2,
    // resizeMode: "cover",
  },
  trashContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "white",

    position: "absolute",
    top: 50,
    right: 170,
    alignItems: "center",
    justifyContent: "center",
  },
  trashCan: {
    color: "tomato",
  },
  photoCamera: {
    gap: 20,
  },

  inputContainer: {
    marginTop: 20,
    marginHorizontal: 40,
    gap: 30,
  },
  input: {
    padding: 10,
    width: "100%",
    fontSize: 16,
    borderBottomColor: "#FFBAC0",
    borderBottomWidth: 2,
  },
  description: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#FFBAC0",
    height: 100,
    textAlignVertical: "top",
  },
  topBtnContainer: {
    alignItems: "center",
    marginTop: 50,
    gap: 10,
  },

  btnContainer: {
    borderColor: "#F95A5F",
    borderWidth: 2,
    height: 50,
    width: 200,
    borderRadius: 25,
    // alignItems: "center",
    // justifyContent: "center",
  },
  btn: {
    paddingTop: 10,
    width: "100%",
    height: "100%",
    fontSize: 20,
    textAlign: "center",
    color: "#737373",
  },
  logout: {
    backgroundColor: "#E7E7E7",
  },
});
