// screens/Shops.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

type Shop = {
  id: number;
  name: string;
  city: string;
  description: string;
  offers?: string;
};

const MOCK_SHOPS: Shop[] = [
  {
    id: 1,
    name: "Casa de Pesca El Anzuelo",
    city: "Montevideo",
    description: "Equipos para pesca de costa, río y embarcado.",
    offers: "Promo caña + reel + nylon.",
  },
  {
    id: 2,
    name: "La Boya Loca",
    city: "Canelones",
    description: "Carnadas, líneas armadas y accesorios.",
    offers: "10% OFF en multifilamento este mes.",
  },
  {
    id: 3,
    name: "Norte Pesca",
    city: "Salto",
    description: "Especialistas en dorado y pesca embarcada.",
  },
];

const ShopsScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#00141c" }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#fff",
          marginBottom: 12,
        }}
      >
        Tiendas y casas de pesca
      </Text>

      <Text style={{ color: "#9ca3af", marginBottom: 16 }}>
        Más adelante podemos conectar esto a Supabase para que las casas
        publiquen sus productos y ofertas. Por ahora es un listado de ejemplo.
      </Text>

      <FlatList
        data={MOCK_SHOPS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 8,
              backgroundColor: "#022733",
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#e5e7eb" }}
            >
              {item.name}
            </Text>
            <Text style={{ color: "#9ca3af" }}>{item.city}</Text>
            <Text style={{ marginTop: 4, color: "#d1d5db" }}>
              {item.description}
            </Text>
            {item.offers ? (
              <Text style={{ marginTop: 6, color: "#22c55e" }}>
                Ofertas: {item.offers}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ShopsScreen;
