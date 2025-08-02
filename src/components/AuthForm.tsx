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
    else router.push('/dashboard');
    setLoading(false);
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(error.message);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 border border-gray-300 dark:border-gray-700 rounded-3xl shadow-lg bg-white dark:bg-neutral-900 transition-colors">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900 dark:text-white select-none">
        {isLogin ? 'Welcome Back 👋' : 'Create Your Account'}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="Email"
            autoComplete="username"
            {...register('email')}
            className={`w-full rounded-xl border px-4 py-3 text-gray-800 dark:text-white bg-gray-50 dark:bg-neutral-800 placeholder-gray-400 dark:placeholder-gray-500 transition 
              ${
                errors.email
                  ? 'border-red-500 ring-red-300 focus:ring-red-300'
                  : 'border-gray-300 dark:border-neutral-700 focus:border-blue-500 focus:ring-blue-300 dark:focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            {...register('password')}
            className={`w-full rounded-xl border px-4 py-3 text-gray-800 dark:text-white bg-gray-50 dark:bg-neutral-800 placeholder-gray-400 dark:placeholder-gray-500 transition 
              ${
                errors.password
                  ? 'border-red-500 ring-red-300 focus:ring-red-300'
                  : 'border-gray-300 dark:border-neutral-700 focus:border-blue-500 focus:ring-blue-300 dark:focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && (
          <p className="text-red-600 text-center font-semibold mt-2 select-none">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-lg shadow-md hover:brightness-110 transition disabled:opacity-70 disabled:cursor-not-allowed select-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Please wait...
            </span>
          ) : isLogin ? (
            'Login'
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8 text-center">
        <span className="bg-white dark:bg-neutral-900 px-3 text-gray-400 font-semibold text-sm select-none">
          OR
        </span>
        <div className="absolute w-full border-t border-gray-200 dark:border-gray-700 left-0 top-1/2 -z-10"></div>
      </div>

      {/* Social Auth Buttons */}
      <div className="space-y-4">
        <button
          onClick={() => handleOAuth('google')}
          type="button"
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 dark:border-neutral-700 py-3 bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-white font-semibold shadow-md hover:bg-gray-100 dark:hover:bg-neutral-700 transition select-none"
        >
          <Image src="/icons/google.svg" height={24} width={24} alt="Google" />
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuth('github')}
          type="button"
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 dark:border-neutral-700 py-3 bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-white font-semibold shadow-md hover:bg-gray-100 dark:hover:bg-neutral-700 transition select-none"
        >
          <Image src="/icons/github.svg" height={24} width={24} alt="GitHub" />
          Continue with GitHub
        </button>
      </div>

      {/* Toggle login/signup */}
      <p className="mt-6 text-center text-gray-600 dark:text-gray-400 select-none">
        {isLogin ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setIsLogin(false)}
              type="button"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setIsLogin(true)}
              type="button"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
