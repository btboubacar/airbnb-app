import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function SettingsScreen({ setToken }) {
  return (
    <View>
      <Text>SettingsScreen</Text>
      <TouchableOpacity>
        <Text
          onPress={() => {
            setToken(null);
          }}
        >
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
