// hooks/useGuides.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type Guide = {
  id: string;
  title: string;
  location_summary: string | null;
  image_url: string | null;
  author: string | null;
  rating: number | null;
  reviews: number | null;
  environment: string | null; // agua-dulce / agua-salada / etc.
  style: string | null;       // costa / kayak / spinning / etc.
  equipment: string[] | null; // array de nombres de equipos
  baits: string[] | null;     // array de carnadas
  lures: string[] | null;     // array de señuelos
  species: string[] | null;   // array de especies objetivo
  description: string | null; // texto más largo de explicación
};

export function useGuides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("guides")
          .select("*")
          .order("title", { ascending: true });

        if (error) throw error;

        setGuides((data || []) as Guide[]);
      } catch (err: any) {
        setError(err.message ?? "Error al cargar guías");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { guides, loading, error };
}
