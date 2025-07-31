import z from "zod";

export const JDSchema = z.object({
  resume: z
    .any()
    .refine((files) => files?.length === 1, {
      message: 'Resume is required',
    }),
  jd: z.string().min(10, {
    message: 'Job Description must be at least 10 characters.',
  }),
})