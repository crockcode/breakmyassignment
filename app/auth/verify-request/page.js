'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function VerifyRequest() {
  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto card bg-base-200 border border-base-300 shadow-xl p-8 text-center">
          <div className="text-5xl mb-6">📩</div>
          <h1 className="text-3xl font-bold mb-3">Check your email</h1>
          <p className="text-base-content/70 mb-6">
            A sign-in link has been sent to your email address.<br />
            Click the link to complete your sign in.
          </p>

          <div className="alert alert-info text-left mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              The link expires in 5 minutes. If you don't see the email, check your spam or promotions folder.
            </span>
          </div>

          <div className="space-y-4">
            <Link href="/auth/signin" className="btn btn-primary btn-block">
              🔄 Back to Sign In
            </Link>
            <Link href="/" className="btn btn-outline btn-block">
              ⬅ Return to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
