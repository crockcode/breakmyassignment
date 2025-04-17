'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import UploadBox from '../../components/UploadBox';
import LimitBanner from '@/components/LimitBanner';

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    // Only redirect after we know the session status
    if (status !== 'loading') {
      setAuthChecked(true);
    }
  }, [status]);
  
  // Get user upload stats from the session 
  const recentUploads = session?.user?.recentUploadCount || 0;
  const isPro = session?.user?.isPro || false;
  
  return (
    <main className="min-h-screen bg-[#171923]">
      <Navbar />
      
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] right-[10%] w-80 h-80 bg-blue-500 opacity-10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-[20%] left-[10%] w-96 h-96 bg-purple-600 opacity-10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md w-fit mx-auto px-6 py-2 rounded-full mb-6 border border-blue-500/30">
            <span className="text-blue-400 font-semibold flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Assignment Analyzer
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Upload Your Assignment
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Let our AI analyze your assignment and break it down into manageable parts. Get a clear roadmap to success in minutes.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="badge bg-blue-500/10 text-blue-400 border-blue-500/30 py-3 px-5 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Save Time
            </div>
            <div className="badge bg-purple-500/10 text-purple-400 border-purple-500/30 py-3 px-5 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Easy Planning
            </div>
            <div className="badge bg-pink-500/10 text-pink-400 border-pink-500/30 py-3 px-5 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Better Grades
            </div>
          </div>
        </div>
        
        {/* Authentication check and limit banner */}
        {status === 'loading' ? (
          <div className="max-w-4xl mx-auto mb-12 flex items-center justify-center py-8">
            <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-blue-500/20 animate-spin"></div>
          </div>
        ) : status === 'unauthenticated' ? (
          <div className="max-w-4xl mx-auto mb-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 md:p-8 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Sign in to track your uploads</h2>
              <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                Create a free account to save your assignment analyses and track your upload usage. Signing in gives you 3 free uploads per month.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signin" className="btn btn-primary btn-lg">
                  Sign in
                </Link>
                <button 
                  onClick={() => setAuthChecked(true)} 
                  className="btn btn-outline btn-lg"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        ) : !isPro && recentUploads >= 3 ? (
          <div className="max-w-4xl mx-auto mb-12">
            <LimitBanner recentUploads={recentUploads} isPro={isPro} />
          </div>
        ) : null}
        
        {/* Only show the upload box if user is not at limit or chose to continue as guest */}
        {(authChecked && (status !== 'authenticated' || isPro || recentUploads < 3)) && (
          <div className="max-w-4xl mx-auto mb-16 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                <UploadBox />
              </div>
            </div>
            
            {/* If authenticated but not at limit, show mild warning */}
            {status === 'authenticated' && !isPro && recentUploads > 0 && (
              <div className="mt-8">
                <LimitBanner recentUploads={recentUploads} isPro={isPro} />
              </div>
            )}
            
            <div className="flex justify-center mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Upload Time</h3>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-1">~5s</div>
                  <p className="text-gray-400 text-sm">Super fast uploads</p>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Analysis</h3>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text mb-1">~30s</div>
                  <p className="text-gray-400 text-sm">AI-powered breakdown</p>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Time Saved</h3>
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 text-transparent bg-clip-text mb-1">Hours</div>
                  <p className="text-gray-400 text-sm">Vs. manual planning</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-xl mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-8 text-center">
              How Our AI Helps You
            </h2>
            
            <div className="grid gap-6">
              <div className="relative bg-gradient-to-r from-blue-500/5 to-transparent p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="absolute -top-3 -left-3 w-16 h-16 bg-blue-500/10 rounded-full filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-start gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Upload in seconds</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Just drag & drop your assignment file - that's it! Our system accepts PDF and DOCX formats up to 10MB. No sign-up required, no complicated forms to fill out.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-gradient-to-r from-purple-500/5 to-transparent p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="absolute -top-3 -left-3 w-16 h-16 bg-purple-500/10 rounded-full filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-start gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Smart breakdown</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Our GPT-4 powered AI identifies key requirements, research needs, and suggests a study plan. It breaks complex tasks into manageable components with clear priorities.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-gradient-to-r from-pink-500/5 to-transparent p-6 rounded-xl border border-pink-500/20 hover:border-pink-500/30 transition-all duration-300 group">
                <div className="absolute -top-3 -left-3 w-16 h-16 bg-pink-500/10 rounded-full filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-start gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">Get a roadmap</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Receive a clear action plan with estimated time for each section. Know exactly where to start, what resources you need, and how to approach each part of your assignment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Pro Tip!</h3>
                  <p className="text-gray-300">
                    Make sure your assignment instructions are clear in the document for the best analysis. The more detailed your document, the more accurate our AI's breakdown will be.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-16 text-center animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-2xl font-bold text-white mb-6">Still have questions?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:bg-white/10 hover:text-white transition-all">
              How accurate is the analysis?
            </button>
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:bg-white/10 hover:text-white transition-all">
              Is my data secure?
            </button>
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:bg-white/10 hover:text-white transition-all">
              Contact Support
            </button>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link href="/dashboard" className="btn btn-primary rounded-xl">
            View Your Dashboard
          </Link>
        </div>
      </div>
      
      {/* Add these styles to the end of the file */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
} 