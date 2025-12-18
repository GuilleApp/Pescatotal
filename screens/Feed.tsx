// screens/Feed.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

export interface Post {
  id: string;
  user_name: string;
  user_avatar: string | null;
  location_name: string | null;
  location_region: string | null;
  image_url: string | null;
  caption: string | null;
  hashtags: string | string[] | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

/**
 * Normaliza la columna "hashtags" de Supabase:
 * - acepta string tipo "corvina playa verano"
 * - o "corvina, playa, verano"
 * - o array de strings
 * y devuelve siempre: ["#corvina", "#playa", "#verano"]
 */
const getHashtagsArray = (raw: Post["hashtags"]): string[] => {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw
      .map((t) => `${t}`.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));
  }

  if (typeof raw === "string") {
    return raw
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));
  }

  return [];
};

const formatTimeAgo = (isoDate: string | null | undefined): string => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));

  if (diffMin < 1) return "Justo ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;

  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Hace ${diffH} h`;

  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Ayer";

  return `Hace ${diffD} días`;
};

const FeedScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando posts:", error);
        return;
      }

      setPosts((data as Post[]) ?? []);
    } catch (err) {
      console.error("Error inesperado cargando posts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const renderPost = ({ item }: { item: Post }) => {
    const hashtagArray = getHashtagsArray(item.hashtags);

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          {item.user_avatar ? (
            <Image source={{ uri: item.user_avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons name="person" size={20} color="#fff" />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{item.user_name}</Text>
            {(item.location_name || item.location_region) && (
              <Text style={styles.locationText}>
                {item.location_name}
                {item.location_region ? ` · ${item.location_region}` : ""}
              </Text>
            )}
            <Text style={styles.timeText}>
              {formatTimeAgo(item.created_at) || "Hace un rato"}
            </Text>
          </View>
        </View>

        {/* Imagen del post */}
        {item.image_url && (
          <Image source={{ uri: item.image_url }} style={styles.postImage} />
        )}

        {/* Caption */}
        {item.caption && <Text style={styles.caption}>{item.caption}</Text>}

        {/* Hashtags en chips */}
        {hashtagArray.length > 0 && (
          <View style={styles.hashtagRow}>
            {hashtagArray.map((tag) => (
              <View key={tag} style={styles.hashtagChip}>
                <Text style={styles.hashtagChipText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f6fb",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#90CAF9",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#12263A",
  },
  locationText: {
    fontSize: 12,
    color: "#607D8B",
  },
  timeText: {
    fontSize: 11,
    color: "#9E9E9E",
  },
  postImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  caption: {
    fontSize: 13,
    color: "#37474F",
    marginBottom: 6,
  },
  hashtagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  hashtagChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
  },
  hashtagChipText: {
    fontSize: 11,
    color: "#0D47A1",
  },
  footer: {
    flexDirection: "row",
    marginTop: 4,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  countText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#37474F",
  },
});
