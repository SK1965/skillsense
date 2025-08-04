'use client';

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, Mail, User, FileText, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { History } from '@/types/history';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  // State for analysis history
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // Fetch analysis history
    const fetchAnalysis = async () => {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[SUPABASE HISTORY ERROR]', error);
      } else {
        setHistory(data || []);
      }
      setLoading(false);
    };

    fetchAnalysis();
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

  // Extract user metadata with safe fallbacks
  const name = user.user_metadata?.name || user.email;
  const avatar = user.user_metadata?.avatar_url;
  const email = user.email;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {avatar ? (
            <Image
              height={56}
              width={56}
              src={avatar}
              alt="User avatar"
              className="h-14 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
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

        {/* Profile Card */}
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
        <section className="mt-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-white">
            Your Past Analyses
          </h2>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Loader2 className="animate-spin h-4 w-4" />
              Loading...
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-neutral-500">No analyses found yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="py-3 flex flex-col sm:flex-row sm:justify-between gap-2"
                >
                  <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <FileText className="w-4 h-4" />
                    <a
                      href={item.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {item.resume_name || 'Resume'}
                    </a>
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Score: <strong>{item.match_score}%</strong> •{' '}
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
