'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Navigation from '@/app/components/Navigation';
import Image from 'next/image';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    year: '',
    department: '',
    team: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Creating your account...');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          year: formData.year,
          department: formData.department,
          team: formData.team,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to create account', { id: loadingToast });
        setLoading(false);
        return;
      }

      toast.success('Account created successfully!', { id: loadingToast });
      console.log('Signup successful');

      try {
        const googleSheetsPayload = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phoneNumber,
          department: formData.department,
          year: formData.year,
          team: formData.team,
        };

        console.log('Sending data to Google Sheets', googleSheetsPayload);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        let sheetsResponse: Response;
        try {
          sheetsResponse = await fetch(
            'https://script.google.com/macros/s/AKfycbx5TkLi04qM5-yfAK7i9TmdyFSG5faLoH5LMuX__naQnkxidYkAqsRLGT3-6B4WG_o/exec',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(googleSheetsPayload),
              signal: controller.signal,
              redirect: 'follow',
              cache: 'no-store',
            }
          );
        } finally {
          clearTimeout(timeoutId);
        }

        console.log('Google Sheets response status', sheetsResponse.status);
        const responseText = await sheetsResponse.text().catch(() => '');
        console.log('Google Sheets response text', responseText);

        let responseJson: any = null;
        if (responseText) {
          try {
            responseJson = JSON.parse(responseText);
          } catch {
            responseJson = null;
          }
        }
        if (responseJson !== null) {
          console.log('Google Sheets response JSON', responseJson);
        }

        if (!sheetsResponse.ok) {
          throw new Error(`Google Sheets request failed (${sheetsResponse.status}): ${responseText}`);
        }

        console.log('Google Sheets success');
      } catch (googleError) {
        console.error('Google Sheets error:', googleError);

        const isLikelyCorsOrNetworkError =
          googleError instanceof TypeError ||
          (googleError instanceof Error &&
            /failed to fetch|networkerror|load failed|cors/i.test(googleError.message));

        if (isLikelyCorsOrNetworkError) {
          console.warn(
            'Google Sheets request likely blocked by CORS/network. Retrying with no-cors fallback...'
          );

          try {
            await fetch(
              'https://script.google.com/macros/s/AKfycbx5TkLi04qM5-yfAK7i9TmdyFSG5faLoH5LMuX__naQnkxidYkAqsRLGT3-6B4WG_o/exec',
              {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                  fullName: formData.fullName,
                  email: formData.email,
                  phone: formData.phoneNumber,
                  department: formData.department,
                  year: formData.year,
                  team: formData.team,
                }),
                redirect: 'follow',
                cache: 'no-store',
              }
            );

            console.log('Google Sheets success (no-cors fallback)');
          } catch (fallbackError) {
            console.error('Google Sheets fallback error:', fallbackError);
            toast.error('Account created, but failed to save registration details to Google Sheets.');
          }
        } else {
          toast.error('Account created, but failed to save registration details to Google Sheets.');
        }
      }

      // Auto sign in after successful signup
      const signInToast = toast.loading('Signing you in...');
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Account created but failed to sign in. Please try signing in.', { id: signInToast });
      } else if (result?.ok) {
        toast.success('Welcome aboard!', { id: signInToast });
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
    } catch (error) {
      console.error('Signup error:', error);
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
        <div className="flex flex-col items-center w-full max-w-[460px] mx-auto py-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
              <Image src="/UN_blue_logo.svg" alt="UNA-ET-HU Logo" fill className="object-contain" priority />
            </div>
            <h2 className="text-[#101618] dark:text-white text-2xl font-extrabold tracking-tight">
              UNA-ET-HU
            </h2>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d23] w-full rounded-xl p-8 shadow-sm">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-[#101618] dark:text-white text-2xl font-bold leading-tight mb-2">
                Create an account
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Join the UNA-ET-HU platform
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full mb-4 flex items-center justify-center gap-3 bg-white dark:bg-[#2d333b] border border-gray-200 dark:border-gray-700 text-[#101618] dark:text-white rounded-lg h-12 font-semibold transition-colors hover:bg-gray-50 dark:hover:bg-[#3d4149] disabled:opacity-50 disabled:cursor-not-allowed"
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#101618] dark:text-gray-200 text-sm font-semibold">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Abebe Kebede"
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[#f4f6f8] dark:bg-[#2d333b] text-[#101618] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-11 px-4 transition-all outline-none placeholder:text-gray-400 disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#101618] dark:text-gray-200 text-sm font-semibold">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+251-900-0000"
                    disabled={loading || googleLoading}
                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[#f4f6f8] dark:bg-[#2d333b] text-[#101618] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-11 px-4 transition-all outline-none placeholder:text-gray-400 disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#101618] dark:text-gray-200 text-sm font-semibold">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="1"
                    min={1}
                    max={10}
                    disabled={loading || googleLoading}
                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[#f4f6f8] dark:bg-[#2d333b] text-[#101618] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-11 px-4 transition-all outline-none placeholder:text-gray-400 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#101618] dark:text-gray-200 text-sm font-semibold">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Department"
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[#f4f6f8] dark:bg-[#2d333b] text-[#101618] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-11 px-4 transition-all outline-none placeholder:text-gray-400 disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#101618] dark:text-gray-200 text-sm font-semibold">
                  Team *
                </label>
                <select
                  required
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[#f4f6f8] dark:bg-[#2d333b] text-[#101618] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-11 px-4 transition-all outline-none disabled:opacity-50"
                >
                  <option value="" disabled className="text-gray-400">
                    Select a team
                  </option>
                  <option value="Model UN Team">Model UN Team</option>
                  <option value="SDG Ambassadors">SDG Ambassadors</option>
                  <option value="Innovation Team">Innovation Team</option>
                  <option value="Debate Team">Debate Team</option>
                  <option value="Project Team">Project Team</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#101618] dark:text-gray-200 text-sm font-semibold">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="abebekebede@example.com"
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[#f4f6f8] dark:bg-[#2d333b] text-[#101618] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-11 px-4 transition-all outline-none placeholder:text-gray-400 disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#101618] dark:text-gray-200 text-sm font-semibold">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[#f4f6f8] dark:bg-[#2d333b] text-[#101618] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-11 px-4 transition-all outline-none placeholder:text-gray-400 disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#101618] dark:text-gray-200 text-sm font-semibold">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[#f4f6f8] dark:bg-[#2d333b] text-[#101618] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-11 px-4 transition-all outline-none placeholder:text-gray-400 disabled:opacity-50"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  disabled={loading || googleLoading}
                />
                <label htmlFor="agree" className="text-sm text-gray-600 dark:text-gray-300">
                  I agree to the <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-primary text-white rounded-lg py-3 font-semibold disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <p className="text-sm text-center text-gray-500">
                Already have an account? <Link href="/auth/signin" className="text-primary">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
