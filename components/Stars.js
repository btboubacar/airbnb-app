import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Stars({ ratingValue, size, style }) {
  const tab = [];
  const max = 5;
  const colors = ["#E6B91E", "#BBBBBB"];
  for (let i = 1; i <= max; i++) {
    if (i <= ratingValue) {
      tab.push(
        <Ionicons
          name="star"
          size={size}
          color={colors[0]}
          style={styles.star}
          key={i}
        />
      );
    } else {
      tab.push(<Ionicons name="star" size={size} color={colors[1]} key={i} />);
    }
  }
  return <View style={styles.star}>{tab}</View>;
}

const styles = StyleSheet.create({
  star: {
    flexDirection: "row",
    gap: 5,
  },
});
