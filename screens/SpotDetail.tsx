// screens/SpotDetail.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Spot } from '../hooks/useSpots';

// ajustá esto a tu definición real de RootStackParamList
type SpotDetailRoute = RouteProp<any, 'SpotDetail'>;

const SpotDetail: React.FC = () => {
  const route = useRoute<SpotDetailRoute>();
  const { spotId } = route.params as { spotId: number };

  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpot = async () => {
      const { data, error } = await supabase
        .from('fishing_spots')
        .select('*')
        .eq('id', spotId)
        .single();

      if (!error) setSpot(data as Spot);
      setLoading(false);
    };

    loadSpot();
  }, [spotId]);

  if (loading || !spot) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Cargando pesquero...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{spot.name}</Text>
      <Text>{spot.department} {spot.region ? `- ${spot.region}` : ''}</Text>

      <Text style={{ marginTop: 8 }}>
        Especies: {spot.main_species || 'N/D'}
      </Text>
      <Text>Mejor época: {spot.best_season || 'N/D'}</Text>
      {spot.description && (
        <Text style={{ marginTop: 8 }}>{spot.description}</Text>
      )}
    </View>
  );
};

export default SpotDetail;
