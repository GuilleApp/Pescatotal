// hooks/useEquipment.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type Equipment = {
  id: number;
  name: string;
  category: string | null;
  type: string | null;        // frontal / rotativo / mosca / etc.
  description: string | null;
  image_url: string | null;
};

export function useEquipment() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("equipment")
          .select("*")
          .order("id");

        if (error) throw error;
        setItems(data as Equipment[]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { items, loading, error };
}
