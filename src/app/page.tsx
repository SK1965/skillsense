import Home from './HomeClient';

//seo metadata
export const metadata = {
  title: 'SkillSense - AI Resume Analyzer',
  description:
    'Upload your resume and job description. Get match score, missing skills, and smart suggestions using AI.',
  openGraph: {
    title: 'SkillSense - AI Resume Analyzer',
    description:
      'Upload resume & job description, get AI-powered match insights!',
    url: 'https://skillsense.vercel.app',
    siteName: 'SkillSense',
    images: [
      {
        url: 'https://skillsense.vercel.app/icons/icon.png',
        width: 1200,
        height: 630,
        alt: 'SkillSense social preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillSense - Resume Match Tool',
    description: 'Try SkillSense – Get smart AI insights into your resume!',
    images: ['https://skillsense.vercel.app/icons/icon.png'],
  },
};

export default function page() {
  return <Home />;
}
