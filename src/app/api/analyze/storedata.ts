import { supabase } from "@/lib/supabase";
import { ResultSchema } from "@/schemas/ResultSchema";
import z from "zod";

interface StoreResumeParams {
  file: File;
  fileBuffer: Buffer;
  fileName: string;
  jd: string;
  result: z.infer<typeof ResultSchema>; // result from Gemini - contains score, suggestions, etc.
}

export async function storeResumeData({
    file ,
    fileBuffer,
    fileName,
    jd,
    result
} : StoreResumeParams) {
    
  // 1. Get user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    console.log('User not logged in. Skipping DB + file storage.');
    return;
  }

  const user = session.user;

  // 2. Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('resumes') // Your bucket name
    .upload(
      `user-${user.id}/${Date.now()}-${fileName}`,
      fileBuffer,
      {
        contentType: file.type,
        upsert: false,
      }
    );

  if (uploadError) {
    console.error('Storage Upload Error:', uploadError.message);
    return;
  }

  // 3. Store in DB
  const { error: dbError } = await supabase
    .from('resumes') // Your table name
    .insert({
      user_id: user.id,
      file_url: uploadData.path,
      file_name: fileName,
      jd,
      score: result.matchScore,
      matched_skills: result.skillsMatched || [],
      missing_skills: result.missingSkills || [],
      suggestions: result.suggestions || '',
    });

  if (dbError) {
    console.error('DB Insert Error:', dbError.message);
  }

}