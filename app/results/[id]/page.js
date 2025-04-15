'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ResultsPage({ params }) {
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/assignments/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch assignment');
        }
        
        const data = await response.json();
        setAssignment(data.assignment);
      } catch (error) {
        console.error('Error fetching assignment:', error);
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchAssignment();
    }
  }, [params.id]);
  
  const renderMarkdown = (markdown) => {
    if (!markdown) return null;
    
    // Very basic markdown parsing for display
    const parsedMarkdown = markdown
      .replace(/# (.*)/g, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
      .replace(/## (.*)/g, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>')
      .replace(/### (.*)/g, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/- (.*)/g, '<li class="ml-5 mb-1">$1</li>')
      .replace(/\n\n/g, '<br />');
    
    return <div dangerouslySetInnerHTML={{ __html: parsedMarkdown }} />;
  };

  return (
    <main className="min-h-screen bg-base-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-lg">Loading assignment analysis...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error my-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
          </div>
        ) : assignment ? (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <div className="badge badge-primary mb-2">Assignment Analysis</div>
                <h1 className="text-3xl font-bold">{assignment.fileName}</h1>
              </div>
              <div className="flex gap-2">
                <a 
                  href={assignment.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm rounded-full"
                >
                  View Original File
                </a>
                <button 
                  className="btn btn-primary btn-sm rounded-full"
                  onClick={() => {
                    navigator.clipboard.writeText(assignment.analysis);
                    // Would add toast notification here
                  }}
                >
                  Copy Analysis
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="col-span-1 lg:col-span-3">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title mb-4 flex items-center gap-2">
                      <span>🧠</span> Assignment Breakdown
                    </h2>
                    <div className="prose max-w-none">
                      {renderMarkdown(assignment.analysis)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1">
                <div className="card bg-base-100 shadow-xl mb-6">
                  <div className="card-body">
                    <h2 className="card-title text-lg">Assignment Info</h2>
                    <div className="py-2">
                      <div className="stat-title">Uploaded</div>
                      <div className="stat-value text-base">
                        {new Date(assignment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="divider my-1"></div>
                    <div className="py-2">
                      <div className="stat-title">File Type</div>
                      <div className="stat-value text-base">
                        {assignment.fileName.split('.').pop().toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-lg">Need More Help?</h2>
                    <p className="text-sm">Upload another assignment or contact support if you need assistance.</p>
                    <div className="card-actions mt-4">
                      <Link href="/upload" className="btn btn-primary btn-sm w-full">Upload New File</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning my-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <h3 className="font-bold">Assignment Not Found</h3>
              <p>The requested assignment could not be found.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 