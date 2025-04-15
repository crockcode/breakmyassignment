'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-base-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="hero min-h-[80vh] bg-base-200 rounded-b-3xl">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="bg-primary/10 w-fit mx-auto px-6 py-2 rounded-full mb-4">
              <span className="text-primary font-semibold">✨ Smart Assignment Helper</span>
            </div>
            <h1 className="text-5xl font-bold mb-2 text-primary">BreakMyAssignment</h1>
            <p className="py-6 text-lg">
              Ready to ace your next assignment? Upload your doc and let our AI break it down into manageable parts. No more staring at a blank page!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload" className="btn btn-primary btn-lg rounded-full px-8 shadow-lg">
                <span className="mr-2">Get Started</span> 🚀
              </Link>
              <a href="#how-it-works" className="btn btn-ghost btn-lg rounded-full">
                How it works ↓
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits */}
      <div className="py-14 container mx-auto px-6">
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="badge badge-lg badge-primary gap-2 p-4 text-base">⏱️ Save hours of planning</div>
          <div className="badge badge-lg badge-secondary gap-2 p-4 text-base">🎯 Focus on what matters</div>
          <div className="badge badge-lg badge-accent gap-2 p-4 text-base">🧠 Understand requirements faster</div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div id="how-it-works" className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold inline-block relative">
            How It Works
            <div className="absolute bottom-0 left-0 w-full h-3 bg-secondary/20 -z-10 transform -rotate-1"></div>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="card bg-base-100 shadow-xl border border-primary/10 hover:shadow-2xl transition-all duration-300">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="card-title text-xl">Upload</h3>
              <p>Drop your PDF or DOCX assignment and let our AI do the boring part. Super quick!</p>
              <div className="card-actions mt-4">
                <div className="badge badge-outline">PDF</div>
                <div className="badge badge-outline">DOCX</div>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl border border-secondary/10 hover:shadow-2xl transition-all duration-300">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <h3 className="card-title text-xl">AI Breakdown</h3>
              <p>Our AI identifies key questions, important references, and an estimated completion time.</p>
              <div className="card-actions mt-4">
                <div className="badge badge-secondary badge-outline">Smart Analysis</div>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl border border-accent/10 hover:shadow-2xl transition-all duration-300">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="card-title text-xl">Get Results</h3>
              <p>Review a clear breakdown of your assignment with actionable insights to get started fast.</p>
              <div className="card-actions mt-4">
                <div className="badge badge-accent badge-outline">Assignment Plan</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonial Section */}
      <div className="container mx-auto px-6 py-16 bg-base-200 rounded-3xl my-10">
        <h2 className="text-2xl font-bold text-center mb-12">What Students Say</h2>
        
        <div className="max-w-3xl mx-auto">
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full bg-primary/20">
                <span className="text-xl text-center w-full leading-10">🧑‍🎓</span>
              </div>
            </div>
            <div className="chat-bubble chat-bubble-primary">
              "BreakMyAssignment saved me so much time on my psychology paper! It broke down the requirements so clearly that I knew exactly what to focus on."
            </div>
            <div className="chat-footer opacity-70 flex gap-1 items-center mt-1">
              <span>Alex, Psychology Major</span>
              <div className="rating rating-sm">
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
              </div>
            </div>
          </div>
          
          <div className="chat chat-end mt-8">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full bg-secondary/20">
                <span className="text-xl text-center w-full leading-10">👩‍🎓</span>
              </div>
            </div>
            <div className="chat-bubble chat-bubble-secondary">
              "I was overwhelmed by my research assignment until I used this tool. It helped me prioritize sections and gave me a realistic timeline."
            </div>
            <div className="chat-footer opacity-70 flex gap-1 items-center justify-end mt-1">
              <span>Jamie, Computer Science</span>
              <div className="rating rating-sm">
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="text-center mt-10 bg-base-200 p-10 rounded-3xl mb-20 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">Ready to crush your assignment?</h3>
        <p className="mb-6 text-lg max-w-md mx-auto">
          Stop stressing and start making progress. Your assignment breakdown is just a few clicks away!
        </p>
        <Link href="/upload" className="btn btn-primary btn-lg rounded-full px-8 shadow-md">
          Upload Your Assignment
        </Link>
        </div>
      </main>
  );
}
