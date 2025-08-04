// lib/saveAnalysisToSupabase.ts
import { ResultSchema } from '@/schemas/ResultSchema';
import { supabase } from './supabase';
import { z } from 'zod';

export async function saveAnalysisToSupabase({
  jd,
  file,
  result,
  userId,
}: {
  jd: string;
  file: File;
  result: z.infer<typeof ResultSchema>;
  userId: string;
}) {
  try {
    // Upload file to Supabase Storage
    const filePath = `user-${userId}/${file.name}`;
    const { error: fileError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, {
        contentType: file.type,
      });

    if (fileError) throw fileError;

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    const resumeUrl = publicUrlData?.publicUrl;
    if (!resumeUrl) throw new Error('Failed to get public URL');

    // Insert analysis data into DB
    const { error: insertError } = await supabase.from('analyses').insert([
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

    if (insertError) throw insertError;

    return { success: true };
  } catch (err) {
    console.error('[SUPABASE ANALYSIS ERROR]', err);
    return { success: false, error: err };
  }
}
