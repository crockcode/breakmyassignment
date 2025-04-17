'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';

// This context will provide methods and session state to the entire app
const AuthContext = createContext();

// Hook for easy access to the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component that wraps app (or portions of app) that need auth state
export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data when session changes
  useEffect(() => {
    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Set user data from session
    setUser({
      ...session.user,
      recentUploadCount: session.user.recentUploadCount || 0,
      isPro: session.user.isPro || false,
    });
    
    setLoading(false);
  }, [session]);

  // Auth methods and state to share with the app
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signin: (callbackUrl) => signIn(null, { callbackUrl }),
    signout: (callbackUrl) => signOut({ callbackUrl }),
    // Calculate remaining uploads for free tier
    remainingUploads: user?.isPro ? 'Unlimited' : (user ? Math.max(0, 3 - (user.recentUploadCount || 0)) : 0),
    // Quick access to user pro status
    isPro: user?.isPro || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Main provider that wraps the whole app
export default function AppAuthProvider({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
} 