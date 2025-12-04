// screens/PostDetail.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase"; // 🔁 ajusta la ruta si es necesario

// mismo user “fake” que en el Feed
const CURRENT_USER_ID = "demo-user-1";
const CURRENT_USER_NAME = "Pescador Demo";

type PostDetailRoute = RouteProp<Record<string, any>, string>;

interface Post {
  id: string;
  user_name: string;
  user_avatar?: string | null;
  location?: string | null;
  image_url: string;
  caption?: string | null;
  hashtags?: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Comment {
  id: number;
  post_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

const DEFAULT_AVATAR =
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800";

const PostDetail: React.FC = () => {
  const route = useRoute<PostDetailRoute>();
  const { post } = route.params as { post: Post };

  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [sending, setSending] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Cargar comentarios del post desde Supabase
  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoadingComments(true);
        const { data, error } = await supabase
          .from("post_comments")
          .select("*")
          .eq("post_id", post.id)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error al cargar comentarios:", error.message);
          setComments([]);
        } else if (data) {
          setComments(data as Comment[]);
        }
      } catch (err) {
        console.error("Error inesperado al cargar comentarios:", err);
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [post.id]);

  // Agregar comentario nuevo
  const handleAddComment = async () => {
    const content = newComment.trim();
    if (!content) return;

    setSending(true);

    try {
      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: post.id,
          user_id: CURRENT_USER_ID,
          user_name: CURRENT_USER_NAME,
          content,
        })
        .select("*")
        .single();

      if (error) {
        console.error("Error al insertar comentario:", error.message);
      } else if (data) {
        // agregar al final de la lista
        setComments((prev) => [...prev, data as Comment]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error inesperado al agregar comentario:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f5f5f7" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Image
            source={{ uri: post.user_avatar || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{post.user_name}</Text>
            <Text style={styles.location}>
              {post.location || "Ubicación no especificada"}
            </Text>
          </View>
          <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
        </View>

        {/* Imagen */}
        <Image source={{ uri: post.image_url }} style={styles.mainImage} />

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <Ionicons name="flame-outline" size={18} color="#ef4444" />
            <Text style={styles.statsText}>{post.likes_count} Me gusta</Text>
          </View>
          <View style={styles.statsItem}>
            <Ionicons name="chatbubble-outline" size={18} color="#3b82f6" />
            <Text style={styles.statsText}>
              {comments.length} comentarios
            </Text>
          </View>
        </View>

        {/* Caption */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Descripción</Text>
          <Text style={styles.captionText}>
            <Text style={styles.userName}>{post.user_name} </Text>
            {post.caption || "Sin descripción"}
          </Text>
          {post.hashtags && (
            <Text style={styles.hashtags}>{post.hashtags}</Text>
          )}
        </View>

        {/* Comentarios */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Comentarios</Text>

          {loadingComments && (
            <View style={styles.commentsLoading}>
              <ActivityIndicator />
              <Text style={styles.commentsLoadingText}>
                Cargando comentarios...
              </Text>
            </View>
          )}

          {!loadingComments && comments.length === 0 && (
            <Text style={styles.placeholderText}>
              Aún no hay comentarios. ¡Sé el primero en comentar! 🎣
            </Text>
          )}

          {!loadingComments &&
            comments.map((c) => (
              <View key={c.id} style={styles.commentRow}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>
                    {c.user_name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.commentBubble}>
                  <Text style={styles.commentUser}>{c.user_name}</Text>
                  <Text style={styles.commentContent}>{c.content}</Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>

      {/* Input comentario */}
      <View style={styles.commentInputBar}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.commentInput}
            placeholder="Añadir un comentario..."
            placeholderTextColor="#9ca3af"
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
        </View>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleAddComment}
          disabled={sending || !newComment.trim()}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="send" size={18} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  location: {
    fontSize: 12,
    color: "#6b7280",
  },
  mainImage: {
    width: "100%",
    height: 320,
    borderRadius: 18,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  statsItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statsText: {
    marginLeft: 4,
    fontSize: 13,
    color: "#111827",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  captionText: {
    fontSize: 13,
    color: "#111827",
  },
  hashtags: {
    marginTop: 4,
    fontSize: 13,
    color: "#059669",
  },
  placeholderText: {
    fontSize: 13,
    color: "#6b7280",
  },

  commentsLoading: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  commentsLoadingText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#6b7280",
  },

  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0ea5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  commentAvatarText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  commentUser: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  commentContent: {
    fontSize: 13,
    color: "#111827",
  },

  commentInputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  commentInput: {
    fontSize: 13,
    color: "#111827",
    maxHeight: 90,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
});
