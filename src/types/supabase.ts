export type Database = {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: number;
          user_id: string;
          file_name: string;
          file_url: string;
          jd: string;
          score: number;
          matched_skills: string[]; // Adjust type based on your schema
          missing_skills: string[];
          suggestions: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          file_name: string;
          file_url: string;
          jd: string;
          score: number;
          matched_skills: string[];
          missing_skills: string[];
          suggestions: string;
        };
        Update: Partial<{
          file_name: string;
          file_url: string;
          jd: string;
          score: number;
          matched_skills: string[];
          missing_skills: string[];
          suggestions: string;
        }>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
