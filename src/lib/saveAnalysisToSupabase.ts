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
    const filePath = `user-${userId}/${file.name}`;
    let resumeUrl: string;

    // First, check if file already exists
    const { data: existingFile} = await supabase.storage
      .from('resumes')
      .list(`user-${userId}`, {
        limit: 1000,
        search: file.name
      });

    const fileExists = existingFile?.some(f => f.name === file.name);

    if (fileExists) {
      // File exists, get the existing public URL
      console.log('[INFO] File already exists, using existing URL...');
      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      resumeUrl = publicUrlData?.publicUrl;
      if (!resumeUrl) throw new Error('Failed to get public URL for existing file');
      
    } else {
      // File doesn't exist, upload it
      console.log('[INFO] File does not exist, uploading...');
      const { error: fileError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          contentType: file.type,
        });

      if (fileError) throw fileError;

      // Get the public URL of the newly uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      resumeUrl = publicUrlData?.publicUrl;
      if (!resumeUrl) throw new Error('Failed to get public URL for uploaded file');
    }

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
