// screens/Profile.tsx
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase"; // 🔁 ajusta si es necesario

// mismos datos de demo que usamos en NewCatch / PostDetail / Feed
const CURRENT_USER_ID = "demo-user-1";
const CURRENT_USER_NAME = "Pescador Demo";

interface Post {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadMyPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, image_url, caption, created_at, likes_count, comments_count, user_name"
        )
        .eq("user_name", CURRENT_USER_NAME)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar posts del perfil:", error.message);
        setPosts([]);
      } else if (data) {
        setPosts(
          data.map((p: any) => ({
            id: p.id,
            image_url: p.image_url,
            caption: p.caption,
            created_at: p.created_at,
            likes_count: p.likes_count,
            comments_count: p.comments_count,
          }))
        );
      }
    } catch (err) {
      console.error("Error inesperado en loadMyPosts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyPosts();
  }, [loadMyPosts]);

  useFocusEffect(
    useCallback(() => {
      loadMyPosts();
    }, [loadMyPosts])
  );

  const totalCatches = posts.length;
  const totalLikes = posts.reduce((sum, p) => sum + p.likes_count, 0);

  const goToNewCatch = () => {
    navigation.navigate("NewCatch");
  };

  const openPost = (post: Post) => {
    navigation.navigate("PostDetail", {
      post: {
        id: post.id,
        user_name: CURRENT_USER_NAME,
        user_avatar: null,
        location: null,
        image_url: post.image_url,
        caption: post.caption,
        hashtags: "#pesca #capturaysuelta",
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        created_at: post.created_at,
      },
    });
  };

  // 💡 Sistema simple de logros calculado en base a capturas y likes
  const achievements: Achievement[] = useMemo(() => {
    return [
      {
        id: "rookie",
        title: "Primer Lanzamiento",
        description: "Registra tu primera captura.",
        icon: "🌱",
        unlocked: totalCatches >= 1,
      },
      {
        id: "active",
        title: "Pescador Activo",
        description: "Alcanza 5 capturas registradas.",
        icon: "🎣",
        unlocked: totalCatches >= 5,
      },
      {
        id: "pro",
        title: "Cazador de Trofeos",
        description: "Alcanza 15 capturas registradas.",
        icon: "🏆",
        unlocked: totalCatches >= 15,
      },
      {
        id: "popular",
        title: "Popular del Muelle",
        description: "Llega a 50 Me gusta en total.",
        icon: "🔥",
        unlocked: totalLikes >= 50,
      },
      {
        id: "legend",
        title: "Leyenda del Río",
        description: "Llega a 150 Me gusta en total.",
        icon: "👑",
        unlocked: totalLikes >= 150,
      },
    ];
  }, [totalCatches, totalLikes]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header Usuario */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarInitial}>
              {CURRENT_USER_NAME.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.userName}>{CURRENT_USER_NAME}</Text>
            <Text style={styles.userSubtitle}>Pescador aficionado</Text>
          </View>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
            <Ionicons name="settings-outline" size={18} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <Text style={styles.statsNumber}>{totalCatches}</Text>
            <Text style={styles.statsLabel}>Capturas</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsNumber}>{totalLikes}</Text>
            <Text style={styles.statsLabel}>Me gusta</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsNumber}>
              {unlockedCount}/{achievements.length}
            </Text>
            <Text style={styles.statsLabel}>Logros</Text>
          </View>
        </View>

        {/* Botón crear captura */}
        <TouchableOpacity
          style={styles.newCatchButton}
          onPress={goToNewCatch}
          activeOpacity={0.9}
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#ffffff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.newCatchButtonText}>Registrar nueva captura</Text>
        </TouchableOpacity>

        {/* Bloque de logros */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tus logros</Text>
        </View>

        <View style={styles.achievementsCard}>
          {achievements.map((ach) => (
            <View key={ach.id} style={styles.achievementRow}>
              <View
                style={[
                  styles.achievementIconWrapper,
                  ach.unlocked
                    ? styles.achievementIconUnlocked
                    : styles.achievementIconLocked,
                ]}
              >
                <Text style={styles.achievementIconText}>{ach.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.achievementTitle,
                    !ach.unlocked && styles.achievementTitleLocked,
                  ]}
                >
                  {ach.title}
                </Text>
                <Text
                  style={[
                    styles.achievementDescription,
                    !ach.unlocked && styles.achievementDescriptionLocked,
                  ]}
                >
                  {ach.description}
                </Text>
              </View>
              <Ionicons
                name={ach.unlocked ? "checkmark-circle" : "lock-closed"}
                size={20}
                color={ach.unlocked ? "#22c55e" : "#9ca3af"}
              />
            </View>
          ))}
        </View>

        {/* Título sección capturas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tus capturas</Text>
        </View>

        {/* Loading / vacío / grid */}
        {loading && (
          <View style={{ marginTop: 16, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 6, color: "#6b7280" }}>
              Cargando tus capturas...
            </Text>
          </View>
        )}

        {!loading && posts.length === 0 && (
          <View style={{ marginTop: 16, alignItems: "center" }}>
            <Text style={{ color: "#6b7280", textAlign: "center" }}>
              Todavía no registraste ninguna captura.
              {"\n"}Usa el botón de arriba para crear la primera 🎣
            </Text>
          </View>
        )}

        {!loading && posts.length > 0 && (
          <View style={styles.grid}>
            {posts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.gridItem}
                onPress={() => openPost(post)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: post.image_url }}
                  style={styles.gridImage}
                />
                <View style={styles.gridOverlay}>
                  <View style={styles.gridOverlayRow}>
                    <Ionicons
                      name="flame-outline"
                      size={14}
                      color="#ffffff"
                    />
                    <Text style={styles.gridOverlayText}>
                      {post.likes_count}
                    </Text>
                  </View>
                  <View style={styles.gridOverlayRow}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={14}
                      color="#ffffff"
                    />
                    <Text style={styles.gridOverlayText}>
                      {post.comments_count}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0ea5e9",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  userSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  statsItem: {
    flex: 1,
    alignItems: "center",
  },
  statsNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  statsLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },

  newCatchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    borderRadius: 999,
    paddingVertical: 10,
    marginBottom: 18,
  },
  newCatchButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  // Card de logros
  achievementsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 18,
  },
  achievementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  achievementIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  achievementIconUnlocked: {
    backgroundColor: "#dcfce7",
  },
  achievementIconLocked: {
    backgroundColor: "#e5e7eb",
  },
  achievementIconText: {
    fontSize: 18,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  achievementTitleLocked: {
    color: "#6b7280",
  },
  achievementDescription: {
    fontSize: 12,
    color: "#4b5563",
  },
  achievementDescriptionLocked: {
    color: "#9ca3af",
  },

  // Grid de capturas
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  gridItem: {
    width: "33.3333%",
    aspectRatio: 1,
    padding: 4,
  },
  gridImage: {
    flex: 1,
    borderRadius: 8,
  },
  gridOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gridOverlayRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  gridOverlayText: {
    color: "#ffffff",
    fontSize: 11,
    marginLeft: 2,
  },
});
