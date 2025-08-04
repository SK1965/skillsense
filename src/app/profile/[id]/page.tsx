'use client';

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, Mail, User, FileText, CalendarDays, BarChart } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else {
      // Fetch user's analysis history
      (async () => {
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching analyses:', error);
        } else {
          setAnalyses(data);
        }
      })();
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">Redirecting to login...</p>
      </div>
    );
  }

  const name = user.user_metadata?.name || user.email;
  const avatar = user.user_metadata?.avatar_url;
  const email = user.email;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Profile Header */}
        <div className="flex items-center gap-4">
          {avatar ? (
            <Image
              height={56}
              width={56}
              src={avatar}
              alt="User avatar"
              className="h-14 w-14 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-semibold">
              {email?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
              Welcome, {name}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage your resume analyses & account
            </p>
          </div>
        </div>

        {/* Profile Info Card */}
        <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
            <Mail className="w-5 h-5" />
            <span className="text-sm break-all">{email}</span>
          </div>

          <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
            <User className="w-5 h-5" />
            <span className="text-sm">User ID: {user.id}</span>
          </div>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/auth');
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </section>

        {/* Analysis History Section */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
            Your Past Analyses
          </h2>

          {analyses.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">No analysis found yet.</p>
          ) : (
            <div className="space-y-4">
              {analyses.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200">
                      <FileText className="w-4 h-4" />
                      <span>{item.resume_name || 'Unnamed Resume'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <CalendarDays className="w-4 h-4" />
                      <span>{new Date(item.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-2 sm:mt-0 text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <BarChart className="w-4 h-4" />
                    Score: {item.match_score}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
