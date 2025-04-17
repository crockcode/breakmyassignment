'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
        router.push('/auth/verify-request');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto card bg-base-200 shadow-xl p-8 border border-base-300">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">📧</div>
            <h1 className="text-3xl font-bold mb-2">Sign In</h1>
            <p className="text-base-content/70">
              Use your email to sign in or create an account
            </p>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Sending link...
                </>
              ) : (
                'Sign in with Email'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-base-content/70">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="link link-primary">Terms</Link> and{' '}
            <Link href="/privacy" className="link link-primary">Privacy Policy</Link>.
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="btn btn-link text-sm">⬅ Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
