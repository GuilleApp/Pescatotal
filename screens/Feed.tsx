// screens/Feed.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase"; // 🔁 ajusta la ruta si es necesario

interface Story {
  id: string;
  name: string;
  avatar: string;
}

interface TrendingItem {
  id: string;
  title: string;
  location: string;
  image: string;
}

// Coincide con la tabla public.posts
interface Post {
  id: string;
  user_name: string;
  user_avatar: string | null;
  location: string | null;
  image_url: string;
  caption: string | null;
  hashtags: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

const DEFAULT_AVATAR =
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800";

// TODO: cuando uses Auth, reemplazar por user.id y user.name reales
const CURRENT_USER_ID = "demo-user-1";

const stories: Story[] = [
  {
    id: "me",
    name: "Tu historia",
    avatar: DEFAULT_AVATAR,
  },
  {
    id: "1",
    name: "Pescador...",
    avatar:
      "https://images.pexels.com/photos/843582/pexels-photo-843582.jpeg",
  },
  {
    id: "2",
    name: "FishMaster",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
  {
    id: "3",
    name: "Ana FlyFish",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
  },
  {
    id: "4",
    name: "Río Hunter",
    avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
  },
];

const trendingItems: TrendingItem[] = [
  {
    id: "t1",
    title: "Trucha Marrón",
    location: "Río Grande",
    image:
      "https://images.pexels.com/photos/209813/pexels-photo-209813.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "t2",
    title: "Dorado",
    location: "Río Paraná",
    image:
      "https://images.pexels.com/photos/2747249/pexels-photo-2747249.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "t3",
    title: "Fly Cast",
    location: "Río Correntoso",
    image:
      "https://images.pexels.com/photos/6290517/pexels-photo-6290517.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const FeedScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});

  // 👉 Función que carga posts + likes del usuario
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);

      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error al obtener posts:", postsError.message);
        setPosts([]);
      } else if (postsData) {
        setPosts(postsData as Post[]);
      }

      // Likes del usuario
      const { data: likesData, error: likesError } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", CURRENT_USER_ID);

      if (likesError) {
        console.error("Error al obtener likes del usuario:", likesError.message);
      } else if (likesData) {
        const likedMap: Record<string, boolean> = {};
        likesData.forEach((row: { post_id: string }) => {
          likedMap[row.post_id] = true;
        });
        setLikedPosts(likedMap);
      }
    } catch (err) {
      console.error("Error inesperado al cargar posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // 🔁 Recargar cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [loadPosts])
  );

  const goToMap = () => navigation.navigate("Mapa");
  const goToNewCatch = () => navigation.navigate("NewCatch");
  const goToGuides = () => navigation.navigate("Guías");

  const handleNotifications = () => {
    Alert.alert("Notificaciones", "Próximamente vas a ver tus alertas acá.");
  };

  const handleSearchFilter = () => {
    Alert.alert("Filtros", "En una próxima versión podrás filtrar el feed.");
  };

  const handleSearchSubmit = (text: string) => {
    if (!text.trim()) return;
    Alert.alert("Buscar", `Buscar: "${text}" (feature futura).`);
  };

  const handleStoryPress = (story: Story) => {
    if (story.id === "me") {
      Alert.alert("Tu historia", "Más adelante podrás subir tus historias.");
    } else {
      Alert.alert(
        "Historia",
        `Ver historias de ${story.name} (feature futura).`
      );
    }
  };

  const isLiked = (postId: string) => !!likedPosts[postId];
  const isSaved = (postId: string) => !!savedPosts[postId];

  const toggleLike = async (post: Post) => {
    const alreadyLiked = isLiked(post.id);

    // like/unlike en memoria
    setLikedPosts((prev) => ({
      ...prev,
      [post.id]: !alreadyLiked,
    }));

    // ajustar contador local
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likes_count: p.likes_count + (alreadyLiked ? -1 : 1),
            }
          : p
      )
    );

    try {
      if (alreadyLiked) {
        const { error: delError } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", CURRENT_USER_ID);

        if (delError) {
          console.error("Error al quitar like:", delError.message);
        }

        const { error: updateError } = await supabase
          .from("posts")
          .update({ likes_count: post.likes_count - 1 })
          .eq("id", post.id);

        if (updateError) {
          console.error(
            "Error al actualizar likes_count (unlike):",
            updateError.message
          );
        }
      } else {
        const { error: insError } = await supabase.from("post_likes").insert({
          post_id: post.id,
          user_id: CURRENT_USER_ID,
        });

        if (insError) {
          console.error("Error al insertar like:", insError.message);
        }

        const { error: updateError } = await supabase
          .from("posts")
          .update({ likes_count: post.likes_count + 1 })
          .eq("id", post.id);

        if (updateError) {
          console.error(
            "Error al actualizar likes_count (like):",
            updateError.message
          );
        }
      }
    } catch (err) {
      console.error("Error inesperado en toggleLike:", err);
    }
  };

  const toggleSave = (post: Post) => {
    setSavedPosts((prev) => ({
      ...prev,
      [post.id]: !prev[post.id],
    }));
  };

  const handleComments = (post: Post) => {
    navigation.navigate("PostDetail", { post });
  };

  const handlePlay = (post: Post) => {
    navigation.navigate("PostDetail", { post });
  };

  const getLikesCount = (post: Post) => post.likes_count;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Explorar</Text>
          <View style={styles.topBarIcons}>
            <TouchableOpacity onPress={goToNewCatch} style={styles.iconButton}>
              <Ionicons name="add-outline" size={22} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNotifications}
              style={styles.iconButton}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#111827"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#6b7280"
            style={{ marginRight: 6 }}
          />
          <TextInput
            placeholder="Buscar publicaciones o usuarios..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={(e) => handleSearchSubmit(e.nativeEvent.text)}
          />
          <TouchableOpacity onPress={handleSearchFilter}>
            <Ionicons name="options-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* STORIES */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storiesRow}
        >
          {stories.map((story: Story, idx: number) => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyItem}
              onPress={() => handleStoryPress(story)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.storyAvatarWrapper,
                  idx === 0 && styles.storyAvatarAddWrapper,
                ]}
              >
                <Image
                  source={{ uri: story.avatar }}
                  style={styles.storyAvatar}
                />
                {idx === 0 && (
                  <View style={styles.storyAddIcon}>
                    <Ionicons name="add" size={16} color="#ffffff" />
                  </View>
                )}
              </View>
              <Text style={styles.storyName} numberOfLines={1}>
                {story.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* EVENT BANNER */}
        <TouchableOpacity style={styles.eventBanner} onPress={goToMap}>
          <Text style={styles.eventLabel}>EVENTO ESPECIAL</Text>
          <Text style={styles.eventTitle}>Torneo de Pesca de Verano</Text>
          <Text style={styles.eventSubtitle}>
            ¡Inscribite ahora y ganá grandes premios!
          </Text>
        </TouchableOpacity>

        {/* TENDENCIAS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tendencias</Text>
          <TouchableOpacity onPress={goToGuides}>
            <Text style={styles.sectionLink}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.trendingRow}
        >
          {trendingItems.map((item: TrendingItem) => (
            <TouchableOpacity
              key={item.id}
              style={styles.trendingCard}
              onPress={goToGuides}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.trendingImage}
              />
              <Text style={styles.trendingTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.trendingSubtitle} numberOfLines={1}>
                {item.location}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LOADING / EMPTY */}
        {loading && (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: "#6b7280" }}>
              Cargando publicaciones...
            </Text>
          </View>
        )}

        {!loading && posts.length === 0 && (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={{ color: "#6b7280" }}>
              Todavía no hay publicaciones. Carga algunas en Supabase 😉
            </Text>
          </View>
        )}

        {/* POSTS */}
        {posts.map((post: Post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Header */}
            <View style={styles.postHeader}>
              <Image
                source={{ uri: post.user_avatar || DEFAULT_AVATAR }}
                style={styles.postAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.postUser}>{post.user_name}</Text>
                <Text style={styles.postLocation}>
                  {post.location || "Ubicación no especificada"}
                </Text>
              </View>
              <Ionicons
                name="ellipsis-horizontal"
                size={18}
                color="#6b7280"
              />
            </View>

            {/* Imagen */}
            <Image source={{ uri: post.image_url }} style={styles.postImage} />

            {/* Actions */}
            <View style={styles.postActionsRow}>
              <View style={styles.postActionsLeft}>
                <TouchableOpacity
                  style={styles.postActionIcon}
                  onPress={() => toggleLike(post)}
                >
                  <Ionicons
                    name="flame-outline"
                    size={22}
                    color={isLiked(post.id) ? "#ef4444" : "#111827"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.postActionIcon}
                  onPress={() => handleComments(post)}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={22}
                    color="#111827"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.postActionIcon}
                  onPress={() => handlePlay(post)}
                >
                  <Ionicons
                    name="play-circle-outline"
                    size={22}
                    color="#111827"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => toggleSave(post)}>
                <Ionicons
                  name={isSaved(post.id) ? "bookmark" : "bookmark-outline"}
                  size={22}
                  color={isSaved(post.id) ? "#2563eb" : "#111827"}
                />
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.postFooter}>
              <Text style={styles.postLikes}>
                {getLikesCount(post)} Me gusta
              </Text>
              <Text style={styles.postCaption}>
                <Text style={styles.postUserBold}>{post.user_name}</Text>
                {" "}
                {post.caption || ""}
                {" "}
                {post.hashtags && (
                  <Text style={styles.postHashtags}>{post.hashtags}</Text>
                )}
              </Text>
              <TouchableOpacity onPress={() => handleComments(post)}>
                <Text style={styles.postComments}>
                  Ver los {post.comments_count} comentarios
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  topBarTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  topBarIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 12,
  },

  // Search
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    marginHorizontal: 4,
  },

  // Stories
  storiesRow: {
    marginVertical: 12,
  },
  storyItem: {
    alignItems: "center",
    marginRight: 14,
    width: 64,
  },
  storyAvatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#22c55e",
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  storyAvatarAddWrapper: {
    borderColor: "#d1d5db",
  },
  storyAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
  },
  storyAddIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  storyName: {
    marginTop: 4,
    fontSize: 11,
    color: "#4b5563",
  },

  // Event banner
  eventBanner: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    backgroundColor: "#111827",
  },
  eventLabel: {
    color: "#22c55e",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  eventTitle: {
    color: "#f9fafb",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  eventSubtitle: {
    color: "#e5e7eb",
    fontSize: 13,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  sectionLink: {
    fontSize: 13,
    color: "#22c55e",
    fontWeight: "600",
  },

  // Trending
  trendingRow: {
    marginBottom: 18,
  },
  trendingCard: {
    width: 140,
    marginRight: 12,
  },
  trendingImage: {
    width: "100%",
    height: 90,
    borderRadius: 14,
    marginBottom: 6,
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  trendingSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },

  // Posts
  postCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  postUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  postLocation: {
    fontSize: 12,
    color: "#6b7280",
  },
  postImage: {
    width: "100%",
    height: 260,
  },
  postActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  postActionsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  postActionIcon: {
    marginRight: 10,
  },
  postFooter: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 4,
  },
  postLikes: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  postCaption: {
    fontSize: 13,
    color: "#111827",
  },
  postUserBold: {
    fontWeight: "700",
  },
  postHashtags: {
    color: "#059669",
  },
  postComments: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
});
