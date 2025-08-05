'use client';

import { LogOut, Mail, User } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface ProfileHeaderProps {
  user: SupabaseUser;
  router: AppRouterInstance;
}

export default function ProfileHeader({ user, router }: ProfileHeaderProps) {
  const name = user.user_metadata?.name ?? user.email;
  const email = user.email;
  const avatar = user.user_metadata?.avatar_url;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 mb-8 shadow-xl border border-white/20 dark:border-slate-700/50">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {avatar ? (
              <Image
                src={avatar}
                alt="User avatar"
                width={80}
                height={80}
                className="h-20 w-20 rounded-2xl border-4 border-white dark:border-slate-700 object-cover shadow-lg"
              />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {email?.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Welcome back, {name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {email}
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm mt-1 flex items-center gap-2">
              <User className="w-4 h-4" />
              ID: {user.id.slice(0, 8)}...
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
