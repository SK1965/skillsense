import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import generate from './generate';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Check if the resume file is part of the form data
    const resumeFile = formData.get('resume');

    if (!(resumeFile instanceof File)) {
      return NextResponse.json(
        { error: 'Resume file is missing or invalid.' },
        { status: 400 },
      );
    }

    // Convert the file to a Buffer
    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());

    // Extract text from the PDF
    const resumeText = await pdf(resumeBuffer).then((data) => data.text);

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Could not extract text from resume PDF.' },
        { status: 400 },
      );
    }

    // Continue processing the resumeText or pass it to other functions

    const result = await generate(resumeText, formData.get('jd') as string);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error('API Error:', err);
    const detail =
      err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to analyze resume', detail },
      { status: 500 },
    );
  }
}
