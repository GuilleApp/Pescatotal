// screens/SpotsList.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useSpots } from '../hooks/useSpots';
import { useNavigation } from '@react-navigation/native';

const SpotsList: React.FC = () => {
  const { spots, loading, error, reload } = useSpots();
  const navigation = useNavigation<any>();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Cargando pesqueros...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
        <TouchableOpacity onPress={reload}>
          <Text style={{ color: 'skyblue' }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={spots}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#333',
            }}
            onPress={() => navigation.navigate('SpotDetail', { spotId: item.id })}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
            <Text style={{ fontSize: 13 }}>
              {item.department} {item.region ? `- ${item.region}` : ''}
            </Text>
            <Text style={{ fontSize: 12, marginTop: 4 }}>
              Especies: {item.main_species || 'N/D'}
            </Text>
            <Text style={{ fontSize: 12 }}>
              Mejor época: {item.best_season || 'N/D'}
            </Text>
            {item.description ? (
              <Text style={{ fontSize: 12, marginTop: 4 }}>{item.description}</Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SpotsList;
