// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// ⚠️ USA TUS DATOS REALES DE SUPABASE
const SUPABASE_URL = "https://rlgalgzdocgztgrfqkxi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ2FsZ3pkb2NnenRncmZxa3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODc3MjcsImV4cCI6MjA3OTY2MzcyN30.Q4NU76bLy6egbfbPVLJ4jp6j44JdwP8sTJglR2-Xv3s";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
