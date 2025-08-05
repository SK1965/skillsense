'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/AuthForm';

export default function AuthPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If user is already logged in, redirect appropriately
    if (user) {
      const redirect = searchParams.get('redirect');

      if (redirect === 'save-report') {
        // Go back to results page with pending save flag
        router.replace('/score?autoSave=true');
      } else {
        // Default redirect to home
        router.replace('/');
      }
    } else {
      setIsLoading(false);
    }
  }, [user, router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-100 via-blue-100 to-indigo-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center px-4">
      <AuthForm />
    </main>
  );
}
