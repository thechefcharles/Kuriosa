/**
 * Supabase database types (generated).
 * Generate with: npx supabase gen types typescript --project-id <ref> > src/types/database.ts
 * See SUPABASE_MIGRATIONS.md for details.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          curiosity_score: number;
          total_xp: number;
          current_level: number;
          current_streak: number;
          longest_streak: number;
          last_active_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: { id: string; [key: string]: unknown };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}
