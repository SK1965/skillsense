import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'SkillSense - AI Resume Analyzer',
  description:
    'Upload your resume and job description. Get match score, missing skills, and smart suggestions using AI.',
  keywords:
    'resume analyzer, ai resume match, job match tool, resume checker, AI resume scoring, job description analysis, skill matching, AI job fit, resume optimization, career tools, job application helper, AI career assistant, resume feedback, job search tools, AI skills assessment, resume improvement, job readiness, AI-driven resume analysis, job matchmaking, AI resume scoring, resume analysis, job description matching',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.ico" sizes="any" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <title>SkillSense - AI Resume Analyzer</title>
        <meta
          name="description"
          content="Upload your resume and job description. Get match score, missing skills, and smart suggestions using AI."
        />
        <meta
          name="keywords"
          content="resume analyzer, ai resume match, job match tool, resume checker, AI resume scoring, job description analysis, skill matching, AI job fit, resume optimization, career tools, job application helper, AI career assistant, resume feedback, job search tools, AI skills assessment, resume improvement, job readiness, AI-driven resume analysis, job matchmaking, AI resume scoring, resume analysis, job description matching"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
