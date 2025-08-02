import { ResultSchema } from '@/schemas/ResultSchema'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import z from 'zod'
import type { Database } from '@/types/supabase'

interface StoreResumeParams {
  file: File
  fileBuffer: Buffer
  fileName: string
  jd: string
  result: z.infer<typeof ResultSchema>
}

export async function storeResumeData({
  file,
  fileBuffer,
  fileName,
  jd,
  result,
}: StoreResumeParams) {
  console.log('[storeResumeData] ▶️ Function called with:', {
    fileName,
    jd,
    result,
  })

  // ✅ Create Supabase client with cookies
  console.log('[storeResumeData] 🛠️ Creating Supabase client...')
  const supabase = createServerComponentClient<Database>({ cookies })

  // ✅ Get the session
  console.log('[storeResumeData] 🔐 Getting user session...')
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('[storeResumeData] ❌ Error getting session:', sessionError.message)
    return
  }

  if (!session?.user) {
    console.log('[storeResumeData] ⚠️ No user session found. Aborting upload.')
    return
  }

  const user = session.user
  console.log('[storeResumeData] 👤 Logged-in user:', user)

  // ✅ Upload file to Supabase Storage
  const filePath = `user-${user.id}/${Date.now()}-${fileName}`
  console.log('[storeResumeData] ☁️ Uploading file to storage at:', filePath)

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('resumes') // Bucket name
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('[storeResumeData] ❌ Upload failed:', uploadError.message)
    return
  }

  console.log('[storeResumeData] ✅ File uploaded successfully:', uploadData)

  // ✅ Insert into resumes table
  console.log('[storeResumeData] 🗃️ Inserting resume metadata into database...')

  const { error: dbError } = await supabase.from('resumes').insert({
    user_id: user.id,
    file_url: uploadData.path,
    file_name: fileName,
    jd,
    score: result.matchScore,
    matched_skills: result.skillsMatched,
    missing_skills: result.missingSkills,
    suggestions: result.suggestions,
  })

  if (dbError) {
    console.error('[storeResumeData] ❌ Database insert failed:', dbError.message)
    return
  }

  console.log('[storeResumeData] ✅ Resume record inserted into database successfully.')
}
