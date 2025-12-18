// screens/PostDetail.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

type Post = {
  id: string;
  authorName: string;
  authorAvatar: string;
  location: string;
  imageUrl: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  caption: string;
  hashtags: string[];
  commentsCount: number;
  createdAt: string;
};

type RouteParams = {
  post: Post;
};

const PostDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation();
  const { post } = route.params as RouteParams;

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll}>
        {/* Header simple */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle de captura</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Info autor */}
        <View style={styles.authorRow}>
          <Image source={{ uri: post.authorAvatar }} style={styles.avatar} />
          <View>
            <Text style={styles.authorName}>{post.authorName}</Text>
            <Text style={styles.location}>{post.location}</Text>
          </View>
        </View>

        {/* Imagen grande */}
        <Image source={{ uri: post.imageUrl }} style={styles.mainImage} />

        {/* Texto y hashtags */}
        <View style={styles.body}>
          <Text style={styles.likes}>
            {post.likes} Me gusta ·{" "}
            <Text style={styles.time}>{post.createdAt}</Text>
          </Text>

          <Text style={styles.caption}>
            <Text style={styles.captionAuthor}>{post.authorName} </Text>
            {post.caption}
          </Text>

          {!!post.hashtags.length && (
            <Text style={styles.hashtags}>{post.hashtags.join(" ")}</Text>
          )}

          {/* Comentarios (placeholder) */}
          <View style={styles.commentsBlock}>
            <Text style={styles.commentsTitle}>
              Comentarios ({post.commentsCount})
            </Text>
            <Text style={styles.commentsEmpty}>
              Próximamente vas a poder ver y agregar comentarios acá 😉
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scroll: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#020617",
  },
  location: {
    fontSize: 12,
    color: "#64748B",
  },
  mainImage: {
    width: "100%",
    height: 300,
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  likes: {
    fontSize: 13,
    fontWeight: "500",
    color: "#020617",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "400",
  },
  caption: {
    fontSize: 13,
    color: "#020617",
  },
  captionAuthor: {
    fontWeight: "600",
  },
  hashtags: {
    marginTop: 2,
    fontSize: 13,
    color: "#0284C7",
  },
  commentsBlock: {
    marginTop: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4,
  },
  commentsEmpty: {
    fontSize: 12,
    color: "#64748B",
  },
});
