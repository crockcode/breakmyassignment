'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const errorMessages = {
  default: "An authentication error occurred",
  Callback: "There was a problem with the login link. Please request a new sign-in link.",
  OAuthCallback: "There was a problem with the OAuth sign-in process.",
  OAuthAccountNotLinked: "This email is already associated with another account.",
  EmailCreateAccount: "Could not create email account.",
  EmailSignin: "Could not send verification email. Please try again.",
  CredentialsSignin: "Invalid login credentials.",
  SessionRequired: "Please sign in to access this page.",
  AccessDenied: "You do not have permission to access this resource."
};

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorType, setErrorType] = useState('default');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error && errorMessages[error]) {
      setErrorType(error);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-base-200 p-8 rounded-2xl shadow-xl border border-base-300">
            <div className="w-16 h-16 mx-auto bg-red-200 text-red-500 flex items-center justify-center rounded-full mb-6 text-3xl">
              ❌
            </div>
            <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
            <p className="text-base-content/70 mb-6">
              {errorMessages[errorType] || errorMessages.default}
            </p>
            <div className="space-y-4">
              <Link href="/auth/signin" className="btn btn-primary w-full">Try Again</Link>
              <Link href="/" className="btn btn-outline w-full">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
