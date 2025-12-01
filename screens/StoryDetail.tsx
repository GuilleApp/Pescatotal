// screens/StoryDetail.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

type Story = {
  id: string;
  title: string;
  image: string;
  description: string;
};

type StoryDetailRouteParams = {
  StoryDetail: {
    story: Story;
  };
};

export default function StoryDetail() {
  const route =
    useRoute<RouteProp<StoryDetailRouteParams, "StoryDetail">>();
  const story = route.params?.story;

  if (!story) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.errorText}>No se encontró la historia.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Imagen grande */}
        <Image
          source={{ uri: story.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Contenido */}
        <View style={styles.content}>
          <Text style={styles.title}>{story.title}</Text>

          <Text style={styles.metaText}>
            Historia de la comunidad UruPesca
          </Text>

          <View style={styles.separator} />

          <Text style={styles.description}>{story.description}</Text>

          <Text style={styles.helper}>
            En versiones futuras vas a poder ver datos de especie, carnada,
            clima y pesquero exacto de cada historia.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020B10",
  },
  scroll: {
    flex: 1,
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  errorText: {
    color: "#E5F4FF",
    fontSize: 14,
  },
  image: {
    width: "100%",
    height: 260,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  metaText: {
    color: "#9FB3C3",
    fontSize: 13,
  },
  separator: {
    height: 1,
    backgroundColor: "#071823",
    marginVertical: 14,
  },
  description: {
    color: "#E5F4FF",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  helper: {
    color: "#7C8A93",
    fontSize: 12,
  },
});
