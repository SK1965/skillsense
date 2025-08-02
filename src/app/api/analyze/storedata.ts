import { createSupabaseServerClient } from "@/lib/supabase";
import { ResultSchema } from "@/schemas/ResultSchema";
import z from "zod";

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
  const supabase = createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    console.log("User not logged in, skipping storage.");
    return;
  }

  const user = session.user;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(`user-${user.id}/${Date.now()}-${fileName}`, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload failed:", uploadError.message);
    return;
  }

  // Insert record in 'resumes' table
  const { error: dbError } = await supabase.from("resumes").insert({
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
    console.error("DB insert failed:", dbError.message);
  }
}
