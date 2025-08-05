'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { authSchema } from '@/schemas/AuthSchema';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchema),
  });

  // Handle successful auth
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect');

      if (redirect === 'save-report') {
        // Redirect to results page with auto-save flag
        router.replace('/score?autoSave=true');
      } else {
        // Default redirect
        router.replace('/');
      }
    }
  }, [user, router, searchParams]);

  const onSubmit = async (data: { email: string; password: string }) => {
    setError('');
    setLoading(true);

    try {
      const authFn = isLogin
        ? supabase.auth.signInWithPassword
        : supabase.auth.signUp;

      const { error: authError, data: authData } = await authFn(data);

      if (authError) {
        setError(authError.message);
        return;
      }

      // For signup, check if email confirmation is required
      if (!isLogin && authData.user && !authData.session) {
        toast.success('Check your email for confirmation link!');
        setIsLogin(true); // Switch to login mode
        return;
      }

      // Success will be handled by the useEffect above when user state changes
      toast.success(
        isLogin ? 'Welcome back!' : 'Account created successfully!',
      );
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError('');

    const redirect = searchParams.get('redirect');
    const redirectTo =
      redirect === 'save-report'
        ? `${window.location.origin}/score?autoSave=true`
        : `${window.location.origin}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="relative max-w-md w-full rounded-3xl border border-white/30 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg shadow-2xl py-12 px-6 sm:px-12">
      {/* Step toggle header */}
      <div className="mb-10 flex items-center justify-center gap-4">
        <button
          type="button"
          className={`px-4 py-2 rounded-xl text-lg font-semibold transition ${
            isLogin
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm'
              : 'bg-transparent text-gray-500 dark:text-neutral-400'
          }`}
          onClick={() => {
            setIsLogin(true);
            setError('');
          }}
          disabled={loading}
        >
          Login
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-xl text-lg font-semibold transition ${
            !isLogin
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm'
              : 'bg-transparent text-gray-500 dark:text-neutral-400'
          }`}
          onClick={() => {
            setIsLogin(false);
            setError('');
          }}
          disabled={loading}
        >
          Sign Up
        </button>
      </div>

      {/* Animated subtitle */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={isLogin ? 'login-head' : 'signup-head'}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.34 }}
          className="text-2xl font-bold text-center mb-7"
        >
          {isLogin ? 'Welcome Back 👋' : 'Create Your Account'}
        </motion.h2>
      </AnimatePresence>

      {/* Show redirect info if coming from save-report */}
      {searchParams.get('redirect') === 'save-report' && (
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
            {isLogin
              ? 'Login to save your analysis report'
              : 'Create account to save your analysis report'}
          </p>
        </div>
      )}

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="Email"
            className={`w-full rounded-xl border px-4 py-3 bg-white/90 dark:bg-neutral-800/80 dark:text-white outline-none transition focus:border-blue-500 ${
              errors.email
                ? 'border-red-500'
                : 'border-gray-300 dark:border-neutral-700'
            }`}
            {...register('email')}
            autoComplete="username"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className={`w-full rounded-xl border px-4 py-3 bg-white/90 dark:bg-neutral-800/80 dark:text-white outline-none transition focus:border-blue-500 ${
              errors.password
                ? 'border-red-500'
                : 'border-gray-300 dark:border-neutral-700'
            }`}
            {...register('password')}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            disabled={loading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm text-center mt-2"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 font-semibold text-base shadow-sm hover:from-blue-700 hover:to-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="inline-block animate-spin w-5 h-5" />}
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8 flex items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-neutral-700" />
        <span className="mx-3 text-gray-500 dark:text-neutral-400 text-sm font-semibold bg-white dark:bg-neutral-900 px-2 rounded-full z-10">
          OR
        </span>
        <div className="flex-grow border-t border-gray-200 dark:border-neutral-700" />
      </div>

      {/* Social Auth Buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => handleOAuth('google')}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-neutral-700 px-4 py-3 text-base font-medium bg-white/90 dark:bg-neutral-800/80 hover:bg-gray-100 dark:hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          disabled={loading}
        >
          <Image src="/icons/google.svg" height={24} width={24} alt="Google" />
          Continue with Google
        </button>

        <button
          onClick={() => handleOAuth('github')}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-neutral-700 px-4 py-3 text-base font-medium bg-white/90 dark:bg-neutral-800/80 hover:bg-gray-100 dark:hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          disabled={loading}
        >
          <Image src="/icons/github.svg" height={24} width={24} alt="GitHub" />
          Continue with GitHub
        </button>
      </div>

      {/* Toggle login/signup */}
      <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
        {isLogin ? (
          <>
            Don&apos;t have an account?&nbsp;
            <button
              className="text-blue-600 font-medium hover:underline"
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              type="button"
              disabled={loading}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?&nbsp;
            <button
              className="text-blue-600 font-medium hover:underline"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              type="button"
              disabled={loading}
            >
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
