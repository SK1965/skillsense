import ResultsPage from './Score';

export const metadata = {
  title: 'Resume Analysis Results | ResumeMatch AI',
  description:
    'See how your resume matches the job description. Get your match score, skill gaps, and AI-powered suggestions to boost your chances.',
  keywords: [
    'resume analysis',
    'job matching',
    'AI resume checker',
    'resume vs JD',
    'match score',
  ],
  openGraph: {
    title: 'Resume Analysis Results | ResumeMatch AI',
    description:
      'See your resume’s match score and missing skills for the job. Get AI-powered tips to improve your chances.',
    url: 'https://skillsense.vercel.app/score',
    siteName: 'ResumeMatch AI',

    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Analysis Results | ResumeMatch AI',
    description:
      'Check your resume match score and skills using ResumeMatch AI. Improve your chances with smart suggestions.',
    images: ['https://skillsense.vercel.app/icons/icon.png'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

// Components

export default function page() {
  return <ResultsPage />;
}
