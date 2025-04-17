'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import LimitBanner from '@/components/LimitBanner';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // If not authenticated, redirect to sign in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);
  
  // Fetch user's assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      if (status !== 'authenticated') return;
      
      try {
        const response = await fetch('/api/assignments');
        
        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }
        
        const data = await response.json();
        setAssignments(data.assignments);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError('Failed to load your assignments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssignments();
  }, [status]);
  
  // Calculate recent uploads (past 30 days)
  const recentUploads = session?.user?.recentUploadCount || 0;
  const isPro = session?.user?.isPro || false;
  
  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-[#171923]">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-blue-500/20 animate-spin"></div>
        </div>
      </main>
    );
  }
  
  if (status === 'unauthenticated') {
    return null; // will redirect via useEffect
  }
  
  return (
    <main className="min-h-screen bg-[#171923]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Your Dashboard</h1>
          <p className="text-gray-400">Manage your assignments and account</p>
        </header>
        
        {/* User info and upload stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{session?.user?.name || 'User'}</h2>
                  <p className="text-gray-400">{session?.user?.email}</p>
                </div>
                {isPro && (
                  <span className="ml-auto px-4 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-sm text-blue-400 border border-blue-500/30">
                    Pro Account
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-white/5">
                  <h3 className="text-gray-400 text-sm mb-1">Monthly Uploads</h3>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold text-white">
                      {recentUploads} <span className="text-sm text-gray-400">/ {isPro ? '∞' : '3'}</span>
                    </div>
                    <div className={`text-sm ${isPro ? 'text-blue-400' : recentUploads >= 3 ? 'text-error' : 'text-warning'}`}>
                      {isPro ? 'Unlimited' : recentUploads >= 3 ? 'Limit reached' : 'Free tier'}
                    </div>
                  </div>
                  {!isPro && (
                    <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${recentUploads >= 3 ? 'bg-error' : 'bg-warning'}`} 
                        style={{ width: `${Math.min(100, (recentUploads / 3) * 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-white/5">
                  <h3 className="text-gray-400 text-sm mb-1">Total Assignments</h3>
                  <div className="text-2xl font-bold text-white">
                    {!loading ? assignments.length : '...'}
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-white/5">
                  <h3 className="text-gray-400 text-sm mb-1">Account Status</h3>
                  <div className="text-xl font-bold text-white">
                    {isPro ? 'Pro' : 'Free'}
                  </div>
                  {!isPro && (
                    <Link href="/pricing" className="text-sm text-blue-400 hover:underline">
                      Upgrade Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <Link 
              href="/upload"
              className="btn btn-primary w-full mb-3 justify-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Assignment
            </Link>
            <Link 
              href="/pricing"
              className={`btn ${isPro ? 'btn-ghost' : 'btn-outline'} w-full mb-3 justify-start`}
              disabled={isPro}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {isPro ? 'Pro Activated' : 'Upgrade to Pro'}
            </Link>
            <button 
              onClick={() => window.open('/api/auth/signout', '_self')}
              className="btn btn-ghost text-gray-400 w-full mt-auto justify-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
        
        {/* Upload limit banner */}
        {!isPro && (
          <LimitBanner 
            recentUploads={recentUploads} 
            isPro={isPro} 
            className="mb-8"
          />
        )}
        
        {/* Recent assignments */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Assignments</h2>
            <Link href="/upload" className="btn btn-sm btn-primary">
              Upload New
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-blue-500/20 animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your assignments...</p>
            </div>
          ) : error ? (
            <div className="bg-error/10 border border-error/30 rounded-xl p-6 my-8">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-error mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold text-error">Error</h3>
                  <p className="text-gray-300">{error}</p>
                </div>
              </div>
            </div>
          ) : assignments.length === 0 ? (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No assignments yet</h3>
              <p className="text-gray-400 mb-6">
                Upload your first assignment to get started
              </p>
              <Link href="/upload" className="btn btn-primary">
                Upload Assignment
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map(assignment => (
                <div 
                  key={assignment._id} 
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 hover:border-blue-500/30 transition-colors overflow-hidden flex flex-col"
                >
                  <div className="p-6 border-b border-white/10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xl">📝</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(assignment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                      {assignment.fileName}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {assignment.analysis.slice(0, 100)}...
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/30 mt-auto">
                    <Link 
                      href={`/results/${assignment._id}`}
                      className="btn btn-sm btn-block btn-outline"
                    >
                      View Analysis
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
} 