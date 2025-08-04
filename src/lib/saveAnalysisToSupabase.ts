// lib/saveAnalysisToSupabase.ts
import { supabase } from './supabase';
import { ResultSchema } from '@/schemas/ResultSchema';
import { z } from 'zod';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
type SaveAnalysisArgs = {
  jd: string;
  file: File;
  result: z.infer<typeof ResultSchema>;
  userId: string;
};

type SaveAnalysisResponse =
  | { success: true; resumeUrl: string }
  | { success: false; error: unknown };

/* ------------------------------------------------------------------ */
/* Main helper                                                        */
/* ------------------------------------------------------------------ */
export async function saveAnalysisToSupabase({
  jd,
  file,
  result,
  userId,
}: SaveAnalysisArgs): Promise<SaveAnalysisResponse> {
  const BUCKET = 'resumes'; // public bucket name
  const filePath = `user-${userId}/${file.name}`; // per-user folder

  try {
    /* 1. Upload (skip if object already exists) -------------------- */
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600', // cache control header (optional)
        upsert: false, // don’t overwrite existing object
      });

    if (uploadErr) {
      const alreadyExists =
        uploadErr.message.includes('already exists') ||
        uploadErr.message.includes('The resource already exists');
      if (!alreadyExists) throw uploadErr;
      // If the object exists we simply reuse it.
    }

    /* 2. Obtain the public URL (never expires) --------------------- */
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    const resumeUrl = publicUrlData?.publicUrl;
    if (!resumeUrl) throw new Error('Failed to obtain public URL');

    /* 3. Persist the analysis row ---------------------------------- */
    const { error: insertErr } = await supabase.from('analyses').insert([
      {
        user_id: userId,
        resume_name: file.name,
        resume_url: resumeUrl,
        job_title: jd || null,
        match_score: result.matchScore,
        skills_matched: result.skillsMatched,
        skills_missing: result.missingSkills,
        ai_suggestions: result.suggestions,
      },
    ]);

    if (insertErr) throw insertErr;

    return { success: true, resumeUrl };
  } catch (error) {
    console.error('[SUPABASE ANALYSIS ERROR]', error);
    return { success: false, error };
  }
}
