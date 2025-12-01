// Layout.tsx
import React from "react";
import { View, Text } from "react-native";

export default function Layout() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00141c",
      }}
    >
      <Text style={{ color: "white", fontSize: 18 }}>
        Layout de prueba sin navegación 👌
      </Text>
    </View>
  );
}
