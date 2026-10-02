import { createClient } from "@supabase/supabase-js";

export type Database = {
  public: {
    Tables: {
      notas_autores_permitidos: {
        Row: {
          user_id: string;
        };
        Insert: {
          user_id: string;
        };
        Update: never;
        Relationships: [];
      };
      notas_compartidas: {
        Row: {
          id: string;
          autor: string;
          contenido: string;
          created_at: string;
        };
        Insert: {
          autor: string;
          contenido: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  client ??= createClient<Database>(url, anonKey);
  return client;
}
