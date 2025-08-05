'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { History } from '@/types/history';

import BackgroundBlobs from '@/components/profilepage/background-blobs';
import ProfileHeader from '@/components/profilepage/profile-header';
import StatsGrid from '@/components/profilepage/stats-grid';
import AnalysisHistory from '@/components/profilepage/analysis-history';
import LoadingState from '@/components/profilepage/loading-state';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error('[SUPABASE HISTORY ERROR]', error);
      else setHistory(data ?? []);
      setLoading(false);
    };

    fetchHistory();
  }, [user, router]);

  if (!user) {
    return <LoadingState message="Redirecting to login..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <BackgroundBlobs />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <ProfileHeader user={user} router={router} />
        <StatsGrid history={history} />
        <AnalysisHistory history={history} loading={loading} />
      </div>
    </div>
  );
}
