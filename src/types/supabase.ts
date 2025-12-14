// Minimal relationship shape to satisfy Supabase's GenericSchema constraints.
// (We avoid importing internal `GenericRelationship` types, since they are not
// exported in all package versions.)
type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  referencedRelation: string;
  referencedColumns: string[];
  isOneToOne?: boolean;
};

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
          id?: number;
          created_at?: string;
          fullname?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          about?: string | null;
          isVerified?: boolean | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          fullname?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          about?: string | null;
          isVerified?: boolean | null;
        };
        Relationships: GenericRelationship[];
      };
    };
    // Use Record<string, never> (not `{ [_ in never]: never }`) so the schema
    // satisfies Supabase's `GenericSchema` constraint and doesn't collapse to `never`.
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type SpecialistRow = Database['public']['Tables']['specialists']['Row'];
export type SpecialistInsert = Database['public']['Tables']['specialists']['Insert'];
export type SpecialistUpdate = Database['public']['Tables']['specialists']['Update'];


