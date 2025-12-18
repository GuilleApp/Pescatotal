// screens/Feed.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// ⚠️ Usa la MISMA import que tengas en otros archivos que usan Supabase
import { supabase } from "../lib/supabase";

const DEFAULT_AVATAR =
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg";
const DEFAULT_POST_IMAGE =
  "https://images.pexels.com/photos/35600/road-sun-rays-path.jpg";

export type Post = {
  id: string;
  user_name: string;
  user_avatar: string | null;
  location_name: string;
  location_area: string | null;
  image_url: string | null;
  title: string;
  description: string;
  hashtags: string[]; // en la base es string, acá lo normalizamos a array
  likes_count: number;
  comments_count: number;
  created_at: string;
};

const normalizePost = (p: any): Post => {
  const rawHashtags = p.hashtags ?? "";

  const hashtagsArray =
    typeof rawHashtags === "string" && rawHashtags.trim().length > 0
      ? rawHashtags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0)
      : [];

  return {
    id: p.id,
    user_name: p.user_name ?? "Pescador",
    user_avatar: p.user_avatar ?? DEFAULT_AVATAR,
    location_name: p.location_name ?? "",
    location_area: p.location_area ?? "",
    image_url: p.image_url ?? DEFAULT_POST_IMAGE,
    title: p.title ?? "",
    description: p.description ?? "",
    hashtags: hashtagsArray,
    likes_count: p.likes_count ?? 0,
    comments_count: p.comments_count ?? 0,
    created_at: p.created_at,
  };
};

const FeedScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar posts desde Supabase
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("❌ Error cargando posts:", error);
          setPosts([]);
        } else if (data) {
          console.log("✅ Posts recibidos desde Supabase:", data);
          const normalized = data.map(normalizePost);
          console.log("✅ Posts normalizados:", normalized);
          setPosts(normalized);
        }
      } catch (e) {
        console.error("❌ Excepción cargando posts:", e);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Log rápido para ver cambios
  useEffect(() => {
    console.log("📌 posts en estado:", posts.length, posts);
  }, [posts]);

  const renderPost = ({ item }: { item: Post }) => {
    const hashtagsText =
      item.hashtags && item.hashtags.length > 0
        ? item.hashtags
            .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
            .join(" ")
        : "";

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: item.user_avatar || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.userName}>{item.user_name}</Text>
            <Text style={styles.location}>
              {item.location_name}
              {item.location_area ? ` · ${item.location_area}` : ""}
            </Text>
          </View>
        </View>

        {/* Imagen principal */}
        {item.image_url && (
          <Image
            source={{ uri: item.image_url || DEFAULT_POST_IMAGE }}
            style={styles.postImage}
          />
        )}

        {/* Cuerpo */}
        <View style={styles.body}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          {hashtagsText !== "" && (
            <Text style={styles.hashtags}>{hashtagsText}</Text>
          )}
        </View>

        {/* Footer con likes y comentarios */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={22} color="#ff4444" />
            <Text style={styles.countText}>{item.likes_count}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubble-outline" size={22} color="#333" />
            <Text style={styles.countText}>{item.comments_count}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Cargando publicaciones...</Text>
        </View>
      )}

      {!loading && posts.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>Todavía no hay publicaciones</Text>
          <Text style={styles.emptyText}>
            Creá tu primer registro en el log para que aparezca aquí.
          </Text>
        </View>
      )}

      {!loading && posts.length > 0 && (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingBottom: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  location: {
    fontSize: 12,
    color: "#777",
  },
  postImage: {
    width: "100%",
    height: 220,
  },
  body: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#444",
  },
  hashtags: {
    marginTop: 6,
    fontSize: 12,
    color: "#1e88e5",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 8,
    justifyContent: "flex-start",
    gap: 16,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  countText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#333",
  },
});
