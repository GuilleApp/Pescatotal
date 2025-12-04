// screens/GuideDetail.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import type { Guide } from "../hooks/useGuides";

interface GuideDetailProps {
  route: { params: { guide: Guide } };
  navigation: any;
}

const GuideDetail: React.FC<any> = ({ route, navigation }) => {
  const { guide } = route.params;

  const {
    title,
    image_url,
    environment,
    style,
    location_summary,
    description,
    equipment,
    baits,
    lures,
    species,
    author,
    rating,
    reviews,
  } = guide;

  const envLabel =
    environment === "agua-dulce"
      ? "Agua dulce"
      : environment === "agua-salada"
      ? "Agua salada"
      : environment || "Entorno N/D";

  const styleLabel = style || "Estilo N/D";

  const ratingText =
    typeof rating === "number"
      ? `${rating.toFixed(1)}${reviews ? ` (${reviews})` : ""}`
      : null;

  const authorInitial =
    author && author.trim().length > 0 ? author.trim()[0].toUpperCase() : "U";

  // Navegar a Guías -> Carnadas
  const goToBaits = (baitName?: string) => {
    navigation.navigate("MainTabs", {
      screen: "Guías",
      params: {
        initialSection: "baits",
        fromGuideBait: baitName ?? null,
      } as any,
    } as any);
  };

  // Navegar a Guías -> Equipamiento
  const goToEquipment = (equipName?: string) => {
    navigation.navigate("MainTabs", {
      screen: "Guías",
      params: {
        initialSection: "gear",
        fromGuideEquipment: equipName ?? null,
      } as any,
    } as any);
  };

  return (
    <ScrollView style={styles.screen}>
      {/* CARD PRINCIPAL */}
      <View style={styles.mainCard}>
        {/* Imagen superior */}
        {image_url && (
          <Image source={{ uri: image_url }} style={styles.mainImage} />
        )}

        {/* Contenido principal */}
        <View style={styles.mainContent}>
          {/* Título */}
          <Text style={styles.title}>{title}</Text>

          {/* Fila autor + rating */}
          <View style={styles.metaRow}>
            {/* Autor */}
            <View style={styles.authorRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{authorInitial}</Text>
              </View>
              <View>
                <Text style={styles.authorName}>
                  {author || "Equipo Urupesca"}
                </Text>
                <Text style={styles.authorSubtitle}>
                  Guía de pesca deportiva
                </Text>
              </View>
            </View>

            {/* Rating si existe */}
            {ratingText && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingStar}>★</Text>
                <Text style={styles.ratingText}>{ratingText}</Text>
              </View>
            )}
          </View>

          {/* Chips de entorno / estilo */}
          <View style={styles.chipsRow}>
            <View style={[styles.chip, styles.chipPrimary]}>
              <Text style={[styles.chipText, styles.chipTextPrimary]}>
                {envLabel}
              </Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{styleLabel}</Text>
            </View>
          </View>

          {/* Ubicación breve */}
          {location_summary && (
            <Text style={styles.locationText}>{location_summary}</Text>
          )}

          {/* Botones rápidos */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🔖</Text>
              <Text style={styles.actionLabel}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionLabel}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* RESUMEN / DESCRIPCIÓN */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Resumen de la guía</Text>
        <Text style={styles.sectionText}>
          {description ||
            "Esta guía describe recomendaciones de equipo, carnadas y especies para este tipo de pesca."}
        </Text>
      </View>

      {/* EQUIPAMIENTO RECOMENDADO */}
      {equipment && equipment.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Equipamiento recomendado</Text>
          {equipment.map((eq: string) => (
            <TouchableOpacity
              key={eq}
              style={styles.itemButton}
              onPress={() => goToEquipment(eq)}
            >
              <View style={styles.itemDot} />
              <Text style={styles.itemText}>{eq}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* CARNADAS */}
      {baits && baits.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Carnadas recomendadas</Text>
          {baits.map((b: string) => (
            <TouchableOpacity
              key={b}
              style={styles.itemButton}
              onPress={() => goToBaits(b)}
            >
              <View style={styles.itemDot} />
              <Text style={styles.itemText}>{b}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* SEÑUELOS */}
      {lures && lures.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Señuelos recomendados</Text>
          {lures.map((l: string) => (
            <View key={l} style={styles.itemButtonDisabled}>
              <View style={styles.itemDot} />
              <Text style={styles.itemText}>{l}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ESPECIES */}
      {species && species.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Especies objetivo</Text>
          {species.map((s: string) => (
            <View key={s} style={styles.itemButtonDisabled}>
              <View style={styles.itemDot} />
              <Text style={styles.itemText}>{s}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ESPACIADO FINAL */}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

export default GuideDetail;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  // CARD PRINCIPAL
  mainCard: {
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  mainImage: {
    width: "100%",
    height: 210,
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0ea5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  authorSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef2ff",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingStar: {
    color: "#f97316",
    marginRight: 4,
  },
  ratingText: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "600",
  },

  chipsRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    marginRight: 8,
  },
  chipPrimary: {
    backgroundColor: "#0ea5e9",
  },
  chipText: {
    fontSize: 12,
    color: "#111827",
  },
  chipTextPrimary: {
    color: "#ffffff",
    fontWeight: "600",
  },

  locationText: {
    marginTop: 10,
    color: "#4b5563",
    fontSize: 13,
  },

  actionsRow: {
    flexDirection: "row",
    marginTop: 14,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  actionIcon: {
    marginRight: 6,
  },
  actionLabel: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "500",
  },

  // SECCIONES
  sectionCard: {
    marginTop: 12,
    marginHorizontal: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  sectionText: {
    color: "#374151",
    fontSize: 14,
    lineHeight: 20,
  },

  // ÍTEMS DE LISTA
  itemButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  itemButtonDisabled: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0ea5e9",
    marginRight: 8,
  },
  itemText: {
    color: "#374151",
    fontSize: 14,
  },
});