import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

// Screens
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import RoomScreen from "./containers/RoomScreen";
import HeaderGoBack from "./components/HeaderGoBack";
import LogoComponent from "./components/LogoComponent";
import AroundMeScreen from "./containers/AroundMeScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const setToken = async (token, id) => {
    if (token && id) {
      try {
        await AsyncStorage.setItem("userToken", JSON.stringify([token, id]));
      } catch (error) {
        console.log(error.response);
      }
    } else {
      try {
        await AsyncStorage.removeItem("userToken");
      } catch (error) {
        console.log(error.response);
      }
    }
    setUserToken(token);
    setUserId(id);
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      // await AsyncStorage.removeItem("userToken");
      const value = await AsyncStorage.getItem("userToken");
      let tab = "";
      if (value) tab = JSON.parse(value);

      // const id = await AsyncStorage.getItem("userid");
      // if (token && id) {
      if (tab.length > 0) {
        setUserToken(tab[0]);
        setUserId(tab[1]);
      }

      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          <>
            <Stack.Screen name="SignIn" options={{ headerShown: false }}>
              {(props) => <SignInScreen {...props} setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp" options={{ headerShown: false }}>
              {(props) => <SignUpScreen {...props} setToken={setToken} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="TabHome"
                  options={{
                    headerShown: false,
                    tabBarLabel: "Home",

                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="ios-home" size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Home"
                        options={{
                          title: "",
                          headerTitleAlign: "center",
                          headerTitle: () => <LogoComponent />,
                          headerLeft: ({ canGoBack }) => {
                            return canGoBack ? <HeaderGoBack /> : null;
                          },
                        }}
                      >
                        {() => <HomeScreen />}
                      </Stack.Screen>
                      <Stack.Screen
                        name="Room"
                        options={{
                          // headerShown: false,
                          headerTitleAlign: "center",
                          headerTitle: () => <LogoComponent />,
                          headerLeft:
                            Platform.OS === "ios"
                              ? () => <HeaderGoBack />
                              : () => {},
                        }}
                      >
                        {() => <RoomScreen />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="TabAroundMe"
                  options={{
                    tabBarLabel: "Around me",
                    tabBarIcon: ({ size, color }) => (
                      <FontAwesome
                        name="map-marker"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="AroundMe"
                        options={{
                          headerTitle: () => <LogoComponent />,
                          headerTitleAlign: "center",
                        }}
                      >
                        {(props) => <AroundMeScreen {...props} />}
                      </Stack.Screen>
                      <Stack.Screen
                        name="RoomAround"
                        options={{
                          // headerShown: false,
                          headerTitleAlign: "center",
                          headerTitle: () => <LogoComponent />,
                          headerLeft:
                            Platform.OS === "ios"
                              ? () => <HeaderGoBack />
                              : () => {},
                        }}
                      >
                        {() => <RoomScreen />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="TabProfile"
                  options={{
                    tabBarLabel: "My Profile",
                    tabBarIcon: ({ size, color }) => (
                      <Ionicons
                        name="settings-outline"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Profile"
                        options={{
                          headerTitleAlign: "center",
                          headerTitle: () => <LogoComponent />,
                        }}
                      >
                        {(props) => (
                          <ProfileScreen
                            {...props}
                            setToken={setToken}
                            userToken={userToken}
                            userId={userId}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create();
