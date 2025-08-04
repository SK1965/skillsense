export type History = {
  id: string;
  user_id: string;
  resume_name: string;
  resume_url: string;
  job_title: string | null;
  match_score: number;
  skills_matched: string[];
  skills_missing: string[];
  ai_suggestions: string[];
  extra_suggestions?: string[];
  created_at: string;
};
