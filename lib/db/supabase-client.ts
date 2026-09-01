import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Singleton Supabase Client
 * Note: Karena kita pake PostgreSQL lokal, ini just wrapper
 * Nanti bisa ganti ke Supabase cloud
 */
class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient;

  private constructor() {
    // Untuk development dengan PostgreSQL lokal
    // Nanti ganti dengan Supabase URL & Key untuk production
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key-for-local";

    this.client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  public getClient(): SupabaseClient {
    return this.client;
  }
}

export const supabase = SupabaseService.getInstance().getClient();
