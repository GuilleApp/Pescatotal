import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type Bait = {
  id: string;
  name: string;
  species_target: string[];
  best_season: string | null;
  recommended_rigs: string | null;
  notes: string | null;
};

export function useBaits() {
  const [baits, setBaits] = useState<Bait[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("baits")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;

        setBaits(data as Bait[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { baits, loading, error };
}
