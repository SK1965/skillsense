import { ResultSchema } from '@/schemas/ResultSchema';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import z from 'zod';
import type { Database } from '@/types/supabase'; // optional if using generated types

interface StoreResumeParams {
  file: File;
  fileBuffer: Buffer;
  fileName: string;
  jd: string;
  result: z.infer<typeof ResultSchema>;
}

export async function storeResumeData({
  file,
  fileBuffer,
  fileName,
  jd,
  result,
}: StoreResumeParams) {
  // ✅ Create Supabase client with cookies
  const supabase = createServerComponentClient<Database>({ cookies });

  // ✅ Get the session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    console.log('User not logged in, skipping storage.');
    return;
  }

  const user = session.user;

  // ✅ Upload file to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('resumes') // Bucket name
    .upload(`user-${user.id}/${Date.now()}-${fileName}`, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error('Upload failed:', uploadError.message);
    return;
  }

  // ✅ Insert into resumes table
  const { error: dbError } = await supabase.from('resumes').insert({
    user_id: user.id,
    file_url: uploadData.path,
    file_name: fileName,
    jd,
    score: result.matchScore,
    matched_skills: result.skillsMatched,
    missing_skills: result.missingSkills,
    suggestions: result.suggestions,
  });

  if (dbError) {
    console.error('DB insert failed:', dbError.message);
  }
}
