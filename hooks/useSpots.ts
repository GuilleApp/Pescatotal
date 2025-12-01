// hooks/useSpots.ts
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Spot {
  id: number;
  name: string;
  department: string | null;
  region: string | null;
  latitude: number;
  longitude: number;
  water_type: string | null;
  access_type: string | null;
  main_species: string | null;
  best_season: string | null;
  description: string | null;
  created_at?: string | null;
}

export function useSpots() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpots = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('fishing_spots')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching fishing spots:', error);
      setError('No se pudieron cargar los pesqueros.');
    } else {
      setSpots((data || []) as Spot[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  return { spots, loading, error, reload: fetchSpots };
}

