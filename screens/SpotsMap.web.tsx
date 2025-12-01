// screens/SpotsMap.web.tsx
import React from 'react';
import { View, Text } from 'react-native';

const SpotsMap: React.FC = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
        Mapa no disponible en la versión web.
      </Text>
      <Text style={{ marginTop: 8, textAlign: 'center' }}>
        Abrí la app en tu celular con Expo Go para ver el mapa con los pesqueros.
      </Text>
    </View>
  );
};

export default SpotsMap;
    