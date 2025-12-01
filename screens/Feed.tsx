// screens/Feed.tsx
import React from "react";
import { View, Text } from "react-native";

const FeedScreen: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00141c",
      }}
    >
      <Text style={{ color: "white", fontSize: 18 }}>
        Feed de prueba (placeholder) 👋
      </Text>
    </View>
  );
};

export default FeedScreen;
