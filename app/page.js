'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#171923]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative min-h-[90vh] overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-blue-500 opacity-20 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-purple-600 opacity-20 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
          <div className="absolute top-[60%] right-[30%] w-64 h-64 bg-cyan-400 opacity-10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md w-fit px-6 py-2 rounded-full mb-6 border border-blue-500/30 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                <span className="text-blue-400 font-semibold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI-Powered Assignment Breakthrough
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Break</span>
                <span className="text-white">My</span>
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">Assignment</span>
              </h1>
              
              <p className="text-gray-300 text-xl mb-8 max-w-xl leading-relaxed animate-fadeIn" style={{ animationDelay: '0.7s' }}>
                Transform your assignments from <span className="font-bold text-blue-400">overwhelming</span> to <span className="font-bold text-purple-400">manageable</span> in minutes. Our AI analyzes your documents and creates a personalized roadmap to success.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10 animate-fadeIn" style={{ animationDelay: '0.9s' }}>
                <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">Save 3+ hours per assignment</span>
                </div>
                
                <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-gray-300">Used by 10,000+ students</span>
                </div>
                
                <div className="flex items-center gap-2 bg-pink-500/10 px-4 py-2 rounded-lg border border-pink-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">GPT-4 powered analysis</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{ animationDelay: '1.1s' }}>
                <Link 
                  href="/upload" 
                  className="btn btn-primary btn-lg rounded-xl relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Start Breaking Down Your Assignment
                  </span>
                  <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
                
                <a 
                  href="#how-it-works" 
                  className="btn btn-outline btn-lg rounded-xl text-gray-300 flex items-center gap-2"
                >
                  See How It Works
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="relative w-full max-w-md animate-fadeIn" style={{ animationDelay: '1.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-400">Assignment Analysis</div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-8 w-4/5 bg-blue-500/20 rounded-lg animate-pulse"></div>
                    <div className="h-8 w-3/5 bg-purple-500/20 rounded-lg animate-pulse"></div>
                  </div>
                  
                  <div className="flex gap-3 my-6">
                    <div className="h-10 w-10 rounded-full bg-blue-500/30 flex items-center justify-center text-2xl">
                      📝
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-white/10 rounded-md w-4/5"></div>
                      <div className="h-5 bg-white/10 rounded-md w-3/5"></div>
                    </div>
                  </div>
                  
                  <div className="h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-white/10 p-4">
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-white/10 rounded-sm"></div>
                      <div className="h-4 w-5/6 bg-white/10 rounded-sm"></div>
                      <div className="h-4 w-4/6 bg-white/10 rounded-sm"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Analysis Complete
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white text-sm font-medium">
                      View Results →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-20 animate-fadeIn" style={{ animationDelay: '1.5s' }}>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-300">PDF & DOCX Support</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-gray-300">Secure Processing</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-gray-300">30-Second Results</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#171923] to-transparent"></div>
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
      
      {/* Benefits */}
      <div id="how-it-works" className="py-14 container mx-auto px-6">
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="badge badge-lg gap-2 p-4 text-base bg-blue-500/10 text-blue-400 border-blue-500/30">⏱️ Save hours of planning</div>
          <div className="badge badge-lg gap-2 p-4 text-base bg-purple-500/10 text-purple-400 border-purple-500/30">🎯 Focus on what matters</div>
          <div className="badge badge-lg gap-2 p-4 text-base bg-pink-500/10 text-pink-400 border-pink-500/30">🧠 Understand requirements faster</div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20">
            <span className="text-gray-300 font-medium">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Breaking down your assignments into manageable chunks has never been easier
          </p>
        </div>
        
        <div className="relative">
          {/* Connect line between steps */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📤</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">1. Upload</h3>
              <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors">
                Simply drag & drop your PDF or DOCX assignment file. Our system accepts academic documents up to 10MB.
              </p>
              
              <div className="flex gap-2 mt-auto">
                <span className="text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">PDF</span>
                <span className="text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">DOCX</span>
                <span className="text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">Secure</span>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🧠</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">2. AI Analysis</h3>
              <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors">
                Our GPT-4 powered AI reads and analyzes your assignment, identifying key tasks, requirements, and resource needs.
              </p>
              
              <div className="flex gap-2 mt-auto">
                <span className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">Smart</span>
                <span className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">GPT-4</span>
                <span className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">~30s</span>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-pink-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 group">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-pink-500/10 rounded-full filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-20 h-20 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🎯</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors">3. Get Your Plan</h3>
              <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors">
                Receive a clear, actionable breakdown with time estimates, key concepts, and a suggested approach for each section.
              </p>
              
              <div className="flex gap-2 mt-auto">
                <span className="text-xs text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full">Structured</span>
                <span className="text-xs text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full">Actionable</span>
                <span className="text-xs text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full">Visual</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <Link 
            href="/upload" 
            className="btn btn-primary btn-lg rounded-xl relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Try It Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="text-center mt-20 mb-20 max-w-3xl mx-auto">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-10 border border-white/10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Ready to crush your assignment?</h3>
            <p className="mb-8 text-lg max-w-md mx-auto text-gray-300">
              Stop stressing and start making progress. Your assignment breakdown is just a few clicks away!
            </p>
            <Link 
              href="/upload" 
              className="btn btn-primary btn-lg rounded-xl relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Your Assignment
              </span>
              <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </div>
        </div>
    </div>
    </main>
  );
}
