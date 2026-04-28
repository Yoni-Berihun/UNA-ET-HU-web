'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Navigation from '@/app/components/Navigation';
import Image from 'next/image';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading('Signing in...');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password', { id: loadingToast });
      } else if (result?.ok) {
        toast.success('Signed in successfully!', { id: loadingToast });
        // Small delay to show the success toast
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    toast.loading('Redirecting to Google...');
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#21242c] flex flex-col">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center w-full max-w-[420px] mx-auto py-12">
          {/* Branding Header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
              <Image src="/UN_blue_logo.svg" alt="UNA-ET-HU Logo" fill className="object-contain" priority />
            </div>
            <h2 className="text-[#101618] dark:text-white text-2xl font-extrabold tracking-tight">
              UNA-ET-HU
            </h2>
          </div>

          {/* Central Auth Card (Sign In) */}
          <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d23] w-full rounded-xl p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-[#101618] dark:text-white text-2xl font-bold leading-tight mb-2">
                Welcome back
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full mb-4 flex items-center justify-center gap-3 bg-white dark:bg-[#2d3139] border border-gray-200 dark:border-gray-700 text-[#101618] dark:text-white rounded-lg h-12 font-semibold transition-colors hover:bg-gray-50 dark:hover:bg-[#3d4149] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#1a1d23] text-gray-500 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-[#101618] dark:text-gray-200 text-sm font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[#f4f6f8] dark:bg-[#2d3139] text-[#101618] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-4 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[#101618] dark:text-gray-200 text-sm font-semibold">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-primary text-xs font-bold hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[#f4f6f8] dark:bg-[#2d3139] text-[#101618] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-4 transition-all outline-none disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-12 font-bold tracking-wide transition-colors shadow-md shadow-primary/10 mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-primary font-bold hover:underline ml-1">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-[0.03] pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        </div>
      </div>
    </div>
  );
}
