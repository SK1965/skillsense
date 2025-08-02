'use client';

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to /auth if no user is logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">
          Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Your Profile</h1>

      <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-6 shadow">
        <p className="text-gray-800 dark:text-gray-200 mb-2">
          <strong>Email:</strong> {user.email}
        </p>

        {/* You can add other profile info here, fetched from your DB if you store more */}

        {/* Example: Update password, display name, or logout button */}

        {/* Logout */}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/auth');
          }}
          className="mt-6 rounded bg-red-600 hover:bg-red-700 text-white py-2 px-4 transition"
          type="button"
        >
          Logout
        </button>
      </section>
    </main>
  );
}
