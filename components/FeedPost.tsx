import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type FeedPostType = {
  id: string;
  userName: string;
  userLocation: string;
  userAvatar: string;
  image: string;
  likes: number;
  likedByYou?: boolean;
  caption: string;
  hashtags: string[];
  commentsCount: number;
};

type Props = {
  post: FeedPostType;
};

export const FeedPost: React.FC<Props> = ({ post }) => {
  return (
    <View style={styles.card}>
      {/* Header usuario */}
      <View style={styles.headerRow}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.userLocation}>{post.userLocation}</Text>
          </View>
        </View>

        <TouchableOpacity>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>

      {/* Imagen principal */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: post.image }}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </View>

      {/* Barra de acciones */}
      <View style={styles.actionsRow}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name={post.likedByYou ? "heart" : "heart-outline"}
              size={22}
              color={post.likedByYou ? "#F97373" : "#E5E7EB"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color="#E5E7EB"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="arrow-redo-outline"
              size={22}
              color="#E5E7EB"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name="bookmark-outline"
            size={22}
            color="#E5E7EB"
          />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text style={styles.likesText}>
        {post.likes} Me gusta
      </Text>

      {/* Descripción */}
      <Text style={styles.captionText}>
        <Text style={styles.captionUser}>{post.userName} </Text>
        {post.caption}{" "}
        {post.hashtags.map((tag) => (
          <Text key={tag} style={styles.hashtag}>
            {tag}{" "}
          </Text>
        ))}
      </Text>

      {/* Comentarios */}
      <TouchableOpacity>
        <Text style={styles.commentsText}>
          Ver los {post.commentsCount} comentarios
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#020A0F",
    marginBottom: 24,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#0F172A",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  userName: {
    color: "#F9FAFB",
    fontWeight: "700",
  },
  userLocation: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: "#020617",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  actionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconButton: {
    padding: 4,
  },
  likesText: {
    paddingHorizontal: 14,
    paddingTop: 6,
    color: "#E5E7EB",
    fontWeight: "600",
  },
  captionText: {
    paddingHorizontal: 14,
    paddingTop: 4,
    color: "#E5E7EB",
    fontSize: 13,
  },
  captionUser: {
    fontWeight: "700",
  },
  hashtag: {
    color: "#22D3EE",
  },
  commentsText: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: "#9CA3AF",
    fontSize: 13,
  },
});
