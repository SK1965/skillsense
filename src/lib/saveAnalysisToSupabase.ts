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
    
    // Try to upload the file first
    const { error: fileError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, {
        contentType: file.type,
      });

    // Handle different scenarios
    if (fileError) {
      if (fileError.message.includes('already exists') || fileError.message.includes('The resource already exists')) {
        console.log('[INFO] File already exists, using existing file...');
        // Continue to get the URL of existing file
      } else {
        // If it's a different error, throw it
        throw fileError;
      }
    } else {
      console.log('[INFO] File uploaded successfully...');
    }

    // Get the public URL (works for both existing and newly uploaded files)
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

    console.log('[SUCCESS] Analysis saved successfully!');
    return { success: true };
  } catch (err) {
    console.error('[SUPABASE ANALYSIS ERROR]', err);
    return { success: false, error: err };
  }
}
