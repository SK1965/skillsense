import {
  Award,
  Cpu,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UploadCloud,
  Users,
  Zap,
} from 'lucide-react';

export const stats = [
  { value: '500+', label: 'Resumes Analyzed', icon: Users },
  { value: '94%', label: 'Success Rate', icon: TrendingUp },
  { value: '4.6/5', label: 'User Rating', icon: Star },
  { value: '50+', label: 'Companies', icon: Award },
];

export const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Analysis',
    description:
      'Advanced machine learning algorithms analyze your resume in seconds',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Perfect Job Matching',
    description:
      'Get precise match scores and targeted improvement suggestions',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Rocket,
    title: 'Career Acceleration',
    description: 'Land 3x more interviews with optimized resume content',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Privacy Protected',
    description: 'Your data is encrypted and never shared with third parties',
    gradient: 'from-orange-500 to-red-500',
  },
];

export const steps = [
  {
    icon: UploadCloud,
    title: 'Upload Your Résumé',
    description:
      'Drag and drop or browse to upload your résumé—PDF, DOC, and DOCX are all supported. Secure and instantaneous upload gets you started in seconds.',
    highlight: 'Supports all major formats. No signup required to analyze.',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Parsing',
    description:
      'Our engine scans your résumé line-by-line and deeply parses skills, roles, education, and experience using the latest in AI language models.',
    highlight: 'Understands modern, technical, and creative roles.',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Target,
    title: 'Precision Job Match',
    description:
      'Paste the job description. We analyze, compare, and compute an exact match score, surfacing which skills and keywords stand out—or are missing.',
    highlight: 'Instant feedback with detailed skill-by-skill breakdown.',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    icon: Rocket,
    title: 'Tailored AI Suggestions',
    description:
      'Receive actionable suggestions powered by generative AI—rewrite, reword, and refocus your résumé for the target job.',
    highlight: 'Get a clear checklist and smart content recommendations.',
    gradient: 'from-pink-500 to-orange-600',
  },
  {
    icon: Sparkles,
    title: 'Track & Optimize',
    description:
      'Sign up to unlock progress tracking, save your best results, and monitor your personal improvement over multiple applications.',
    highlight: 'Build your resume journey and measure growth.',
    gradient: 'from-yellow-400 to-amber-500',
  },
];
