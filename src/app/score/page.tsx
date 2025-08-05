'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import { useResumeStore } from '@/stores/resumeStore';
import { ResultSchema } from '@/schemas/ResultSchema';
import z from 'zod';
import ResultHeader from '@/components/resultPage/result-header';
import ScoreSection from '@/components/resultPage/score-section';
import SuggestionsSection from '@/components/resultPage/suggestions-section';
import SkillsGrid from '@/components/resultPage/skills-grid';
import ActionButtons from '@/components/resultPage/action-buttons';
import Navbar from '@/components/navbar';

// Components

export default function ResultsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { resume, jd } = useResumeStore();
  const [results, setResults] = useState<z.infer<typeof ResultSchema>>();
  const [score, setScore] = useState(0);
  const confettiFired = useRef(false);

  // Load and validate results
  useEffect(() => {
    const storedResult = sessionStorage.getItem('analysisResult');
    if (storedResult) {
      try {
        const parsedData = JSON.parse(storedResult);
        const validation = ResultSchema.safeParse(parsedData);
        if (validation.success) setResults(validation.data);
        else router.push('/');
      } catch {
        router.push('/');
      }
    } else router.push('/');
  }, [router]);

  // Dramatic score count-up
  useEffect(() => {
    if (!results) return;
    let num = 0;
    const target = results.matchScore;
    const increment = Math.ceil(target / 30);
    const id = setInterval(() => {
      num = Math.min(num + increment, target);
      setScore(num);
      if (num >= target) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [results]);

  // Confetti on high match
  useEffect(() => {
    if (results && results.matchScore >= 80 && !confettiFired.current) {
      confettiFired.current = true;
      confetti({ particleCount: 110, spread: 72, origin: { y: 0.4 } });
    }
    if (results && results.matchScore < 80) confettiFired.current = false;
  }, [results]);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100 dark:bg-neutral-950">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-blue-50/85 via-white to-green-50/85 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-neutral-900 dark:text-white flex flex-col justify-center">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full space-y-14 sm:space-y-16">
        <ResultHeader />
        <ScoreSection score={score} matchScore={results.matchScore} />
        <SkillsGrid
          skillsMatched={results.skillsMatched}
          missingSkills={results.missingSkills}
        />
        <SuggestionsSection suggestions={results.suggestions} />
        <SuggestionsSection
          suggestions={results.extraEdgeSuggestions}
          variant="standout"
        />
        <ActionButtons results={results} resume={resume} jd={jd} user={user} />
      </div>
    </main>
  );
}
