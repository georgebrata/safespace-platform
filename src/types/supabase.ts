export type Database = {
  public: {
    Tables: {
      specialists: {
        Row: {
          id: number;
          created_at: string;
          fullname: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          about: string | null;
          isVerified: boolean | null;
        };
        Insert: {
          created_at?: string;
          fullname?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          about?: string | null;
          isVerified?: boolean | null;
        };
        Update: {
          created_at?: string;
          fullname?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          about?: string | null;
          isVerified?: boolean | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type SpecialistRow = Database['public']['Tables']['specialists']['Row'];
export type SpecialistInsert = Database['public']['Tables']['specialists']['Insert'];
export type SpecialistUpdate = Database['public']['Tables']['specialists']['Update'];


