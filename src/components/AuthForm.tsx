'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authSchema } from '@/schemas/AuthSchema';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setError('');
    setLoading(true);

    const authFn = isLogin
      ? supabase.auth.signInWithPassword
      : supabase.auth.signUp;

    const { error } = await authFn(data);

    if (error) setError(error.message);
    else router.replace('/');
    setLoading(false);
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded-xl bg-white dark:bg-neutral-900 shadow">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'Welcome Back 👋' : 'Create Your Account'}
      </h2>

      {/* Email/Password Auth - Now ABOVE */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            className={`w-full rounded border p-2 dark:bg-neutral-800 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-neutral-700'}`}
            {...register('email')}
            autoComplete="username"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className={`w-full rounded border p-2 dark:bg-neutral-800 dark:text-white ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-neutral-700'}`}
            {...register('password')}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black text-white py-2 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 text-center">
        <span className="px-3 text-gray-500 text-sm bg-white dark:bg-neutral-900 z-10 relative">
          OR
        </span>
        <div className="absolute left-0 top-1/2 w-full border-t border-gray-200 dark:border-neutral-700 -z-10" />
      </div>

      {/* Social Auth Buttons - Images used */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => handleOAuth('google')}
          className="w-full flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-800"
          type="button"
        >
          <Image src="/icons/google.svg" height={24} width={24} alt="Google" />
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuth('github')}
          className="w-full flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-800"
          type="button"
        >
          <Image src="/icons/github.svg" height={24} width={24} alt="GitHub" />
          Continue with GitHub
        </button>
      </div>

      <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
        {isLogin ? (
          <>
            Don&apos;t have an account? &nbsp;
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setIsLogin(false)}
              type="button"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setIsLogin(true)}
              type="button"
            >
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
