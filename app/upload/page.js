'use client';

import Navbar from '../../components/Navbar';
import UploadBox from '../../components/UploadBox';

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-base-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="bg-primary/10 w-fit mx-auto px-5 py-2 rounded-full mb-3">
            <span className="text-primary font-semibold">📝 Assignment Analyzer</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-primary">Upload Your Assignment</h1>
          <p className="text-base-content/70 max-w-lg mx-auto">
            Drop your PDF or DOCX files and let our AI do the heavy lifting. We'll break it down into manageable parts.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            <div className="badge badge-outline badge-primary">Save Time</div>
            <div className="badge badge-outline badge-primary">Easy Planning</div>
            <div className="badge badge-outline badge-primary">Better Grades</div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <UploadBox />
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <div className="stats shadow">
              <div className="stat place-items-center">
                <div className="stat-title">Upload Time</div>
                <div className="stat-value text-primary">~5s</div>
                <div className="stat-desc">Super fast!</div>
              </div>
              
              <div className="stat place-items-center">
                <div className="stat-title">Analysis</div>
                <div className="stat-value text-secondary">~30s</div>
                <div className="stat-desc">AI-powered</div>
              </div>
              
              <div className="stat place-items-center">
                <div className="stat-title">Time Saved</div>
                <div className="stat-value text-accent">Hours</div>
                <div className="stat-desc">Compared to manual planning</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 bg-base-200 p-8 rounded-3xl max-w-3xl mx-auto shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">How Our AI Helps You</h2>
          <div className="grid gap-4">
            <div className="flex items-start gap-4 bg-base-100 p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Upload in seconds</h3>
                <p className="text-base-content/70 text-sm">Just drag & drop your assignment file - that's it! No sign-up required.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-base-100 p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-secondary">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Smart breakdown</h3>
                <p className="text-base-content/70 text-sm">Our AI identifies key requirements, research needs, and suggests a study plan.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-base-100 p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-accent">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Get a roadmap</h3>
                <p className="text-base-content/70 text-sm">Receive a clear action plan with estimated time for each section. No more guesswork!</p>
              </div>
            </div>
          </div>
          
          <div className="alert alert-info mt-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <div className="font-medium">Pro Tip!</div>
              <div className="text-xs">Make sure your assignment instructions are clear in the document for the best analysis.</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h3 className="font-bold text-lg mb-3">Still have questions?</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="btn btn-outline btn-sm rounded-full">How accurate is the analysis?</button>
            <button className="btn btn-outline btn-sm rounded-full">Is my data secure?</button>
            <button className="btn btn-outline btn-sm rounded-full">Contact Support</button>
          </div>
        </div>
      </div>
    </main>
  );
} 