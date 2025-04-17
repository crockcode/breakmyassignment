'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ResultsPage({ params }) {
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('breakdown');
  
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
    
    // Enhanced markdown parsing with better styling
    const parsedMarkdown = markdown
      // Headings with more distinctive styling and anchor links
      .replace(/# (.*)/g, '<h1 id="section-$1" class="text-2xl font-bold text-white mt-6 mb-4 border-b border-blue-500/20 pb-2 group"><a href="#section-$1" class="absolute opacity-0 group-hover:opacity-100 -ml-8 pr-2 text-blue-400">#</a>$1</h1>')
      .replace(/## (.*)/g, '<h2 id="subsection-$1" class="text-xl font-bold text-purple-400 mt-6 mb-3 group flex items-center"><span class="w-8 h-0.5 bg-purple-500/30 mr-3"></span><span class="flex-1">$1</span></h2>')
      .replace(/### (.*)/g, '<h3 id="topic-$1" class="text-lg font-semibold text-blue-400 mt-5 mb-2 group flex items-center"><span class="w-5 h-5 rounded-full border border-blue-500/30 mr-3 flex items-center justify-center text-xs">•</span>$1</h3>')
      
      // Bold and italic text with improved styling
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white bg-gradient-to-r from-white to-white bg-[length:0px_1px] hover:bg-[length:100%_1px] bg-no-repeat bg-bottom transition-all duration-300">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
      
      // Lists with better formatting and hover effects
      .replace(/^\d+\.\s+(.*)/gm, '<li class="ml-6 mb-3 list-decimal text-gray-300 hover:text-white transition-colors duration-200"><div class="pl-2 border-l border-blue-500/10 hover:border-blue-500/30 transition-colors duration-200">$1</div></li>') // Ordered lists
      .replace(/^- (.*)/gm, '<li class="ml-6 mb-3 list-disc text-gray-300 hover:text-white transition-colors duration-200"><div class="pl-2 border-l border-purple-500/10 hover:border-purple-500/30 transition-colors duration-200">$1</div></li>') // Unordered lists
      
      // Blockquotes with improved styling
      .replace(/^> (.*)/gm, '<blockquote class="pl-4 py-3 border-l-4 border-blue-500/30 bg-blue-500/5 rounded-r-lg my-4 italic text-gray-300 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200">$1</blockquote>')
      
      // Code blocks and inline code with syntax highlighting hints
      .replace(/```([\s\S]*?)```/g, '<div class="relative bg-gray-800/70 p-3 rounded-lg font-mono text-sm my-4 overflow-x-auto text-gray-300 border border-white/5 hover:border-white/10 transition-colors"><div class="absolute top-0 right-0 px-2 py-1 text-xs bg-gray-700/50 rounded-bl-lg text-gray-400">code</div><pre class="whitespace-pre-wrap">$1</pre></div>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-800/70 px-2 py-0.5 rounded text-sm font-mono text-gray-300 border border-white/5">$1</code>')
      
      // Links with better styling and transition effects
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 underline decoration-blue-400/30 hover:decoration-blue-400 underline-offset-2 hover:text-blue-300 transition-all duration-200" target="_blank">$1</a>')
      
      // Special treatment for time estimates
      .replace(/(\d+[-\d\s]*(?:to\s*)?(?:hours|hour))/gi, '<span class="bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">$1</span>')
      
      // Highlight key terms
      .replace(/(key concepts|important references|suggested approach|estimated time|breakdown|requirements|resources needed)/gi, '<span class="text-yellow-400 font-medium">$1</span>')
      
      // Add special styling for parts and sections
      .replace(/(part \d+|section \d+)/gi, '<span class="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">$1</span>')
      
      // Paragraphs and spacing with improved styling
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-300 leading-relaxed">')
      
      // Wrap in paragraph if not starting with a block element
      .replace(/^(?!<h1|<h2|<h3|<ul|<ol|<blockquote|<div)/m, '<p class="mb-4 text-gray-300 leading-relaxed">');
    
    // Wrap lists properly
    let wrappedMarkdown = parsedMarkdown
      .replace(/<li class="ml-6 mb-3 list-decimal/g, '<ol class="my-4 space-y-1"><li class="ml-6 mb-3 list-decimal')
      .replace(/<li class="ml-6 mb-3 list-disc/g, '<ul class="my-4 space-y-1"><li class="ml-6 mb-3 list-disc');
    
    // Close lists properly (simple approximation)
    wrappedMarkdown = wrappedMarkdown
      .replace(/<\/li>\s*(?!<li|<\/ul|<\/ol)/g, '</li></ul>')
      .replace(/<\/li>\s*(?!<li|<\/ul|<\/ol)/g, '</li></ol>');
    
    return <div dangerouslySetInnerHTML={{ __html: wrappedMarkdown }} />;
  };

  const copyToClipboard = () => {
    if (assignment?.analysis) {
      navigator.clipboard.writeText(assignment.analysis);
      // You would add a toast notification here in a real app
      alert("Analysis copied to clipboard!");
    }
  };

  // Add this function to make sections collapsible
  const initializeCollapsibleSections = () => {
    useEffect(() => {
      if (assignment?.analysis && activeTab === 'breakdown') {
        // Add collapsible functionality to sections using client-side JS
        const headings = document.querySelectorAll('h2');
        headings.forEach(heading => {
          const content = [];
          let el = heading.nextElementSibling;
          
          // Collect all elements until the next h2
          while (el && el.tagName !== 'H2') {
            content.push(el);
            el = el.nextElementSibling;
          }
          
          // Add toggle functionality
          heading.style.cursor = 'pointer';
          heading.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>';
          
          // Toggle click handler  
          heading.addEventListener('click', () => {
            const expanded = heading.getAttribute('aria-expanded') === 'true';
            heading.setAttribute('aria-expanded', !expanded);
            
            // Toggle the content visibility
            content.forEach(el => {
              el.style.display = expanded ? 'none' : '';
            });
            
            // Rotate the arrow
            const arrow = heading.querySelector('svg');
            arrow.style.transform = expanded ? '' : 'rotate(180deg)';
          });
          
          // Initialize as expanded
          heading.setAttribute('aria-expanded', 'true');
        });
      }
    }, [assignment, activeTab]);
  };
  
  // Call the initialization function
  initializeCollapsibleSections();

  // Add this function to extract time estimates and create a summary
  const generateSummary = (analysis) => {
    if (!analysis) return null;
    
    // Extract time estimates
    const timeMatch = analysis.match(/(\d+[-\d\s]*(?:to\s*)?(?:hours|hour))/i);
    const timeEstimate = timeMatch ? timeMatch[0] : "1-2 hours";
    
    // Extract assignment type
    let assignmentType = "General Assignment";
    if (analysis.toLowerCase().includes("essay")) assignmentType = "Essay";
    else if (analysis.toLowerCase().includes("report")) assignmentType = "Report";
    else if (analysis.toLowerCase().includes("research")) assignmentType = "Research";
    else if (analysis.toLowerCase().includes("question")) assignmentType = "Questions";
    
    // Extract difficulty
    let difficulty = "Moderate";
    if (analysis.toLowerCase().includes("complex") || analysis.toLowerCase().includes("challenging")) 
      difficulty = "Challenging";
    else if (analysis.toLowerCase().includes("easy"))
      difficulty = "Easy";
    
    // Count resources
    const resourcesCount = (analysis.match(/reference|source|cite|book|article|journal|website/gi) || []).length;
    
    return { timeEstimate, assignmentType, difficulty, resourcesCount };
  };

  return (
    <main className="min-h-screen bg-[#171923]">
      <Navbar />
      
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[10%] w-96 h-96 bg-blue-500 opacity-10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-purple-600 opacity-10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10 animate-fadeIn">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-500 border-blue-500/20 animate-spin"></div>
              <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-t-purple-500 border-purple-500/20 animate-spin-slow"></div>
            </div>
            <p className="text-lg text-gray-300 mt-6">Loading your assignment analysis...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 my-8 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold text-red-500">Error Loading Assignment</h3>
                <p className="text-gray-300 mt-1">{error}</p>
                <Link 
                  href="/upload"
                  className="mt-4 inline-block px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
                >
                  Return to Upload
                </Link>
              </div>
            </div>
          </div>
        ) : assignment ? (
          <div>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md w-fit mx-auto px-6 py-2 rounded-full mb-8 border border-blue-500/30">
              <span className="text-blue-400 font-semibold flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Assignment Analysis
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 max-w-5xl mx-auto">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                  {assignment.fileName}
                </h1>
                <p className="text-gray-400">
                  Uploaded on {new Date(assignment.createdAt).toLocaleDateString()} • {assignment.fileName.split('.').pop().toUpperCase()} file
                </p>
              </div>
              <div className="flex gap-3">
                <a 
                  href={assignment.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800/80 text-gray-300 rounded-lg text-sm border border-white/10 transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Original
                </a>
                <button 
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm border border-blue-500/30 transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Analysis
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="lg:col-span-3 order-2 lg:order-1">
                <div className="mb-6 flex border-b border-white/10">
                  <button 
                    onClick={() => setActiveTab('breakdown')}
                    className={`px-6 py-3 text-sm font-medium relative ${activeTab === 'breakdown' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                  >
                    <span>Analysis Breakdown</span>
                    {activeTab === 'breakdown' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></span>
                    )}
                  </button>
                  <button 
                    onClick={() => setActiveTab('raw')}
                    className={`px-6 py-3 text-sm font-medium relative ${activeTab === 'raw' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                  >
                    <span>Raw Text</span>
                    {activeTab === 'raw' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></span>
                    )}
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mr-4">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        {activeTab === 'breakdown' ? 'Assignment Breakdown' : 'Raw Text Analysis'}
                      </h2>
                    </div>
                    
                    {activeTab === 'breakdown' && assignment?.analysis && (
                      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        {(() => {
                          const summary = generateSummary(assignment.analysis);
                          return (
                            <>
                              <div className="bg-gray-800/30 rounded-xl border border-white/5 p-4 hover:border-blue-500/20 transition-colors">
                                <div className="flex items-center mb-2">
                                  <div className="w-8 h-8 rounded-full bg-blue-500/20 mr-2 flex items-center justify-center text-xl">⏱️</div>
                                  <h3 className="text-sm font-medium text-gray-300">Time Estimate</h3>
                                </div>
                                <p className="text-xl font-semibold text-blue-400">{summary.timeEstimate}</p>
                              </div>
                              <div className="bg-gray-800/30 rounded-xl border border-white/5 p-4 hover:border-purple-500/20 transition-colors">
                                <div className="flex items-center mb-2">
                                  <div className="w-8 h-8 rounded-full bg-purple-500/20 mr-2 flex items-center justify-center text-xl">📝</div>
                                  <h3 className="text-sm font-medium text-gray-300">Assignment Type</h3>
                                </div>
                                <p className="text-xl font-semibold text-purple-400">{summary.assignmentType}</p>
                              </div>
                              <div className="bg-gray-800/30 rounded-xl border border-white/5 p-4 hover:border-pink-500/20 transition-colors">
                                <div className="flex items-center mb-2">
                                  <div className="w-8 h-8 rounded-full bg-pink-500/20 mr-2 flex items-center justify-center text-xl">🏆</div>
                                  <h3 className="text-sm font-medium text-gray-300">Difficulty</h3>
                                </div>
                                <p className="text-xl font-semibold text-pink-400">{summary.difficulty}</p>
                              </div>
                              <div className="bg-gray-800/30 rounded-xl border border-white/5 p-4 hover:border-green-500/20 transition-colors">
                                <div className="flex items-center mb-2">
                                  <div className="w-8 h-8 rounded-full bg-green-500/20 mr-2 flex items-center justify-center text-xl">📚</div>
                                  <h3 className="text-sm font-medium text-gray-300">Resources</h3>
                                </div>
                                <p className="text-xl font-semibold text-green-400">{summary.resourcesCount}+ suggested</p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                    
                    <div className="bg-gradient-to-r from-blue-500/10 to-transparent p-3 rounded-t-lg border border-blue-500/20 mb-4 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      <h3 className="font-bold text-lg text-white">Detailed Breakdown</h3>
                      
                      {activeTab === 'breakdown' && (
                        <div className="ml-auto flex items-center gap-4">
                          <button 
                            onClick={() => {
                              // Expand all sections
                              document.querySelectorAll('h2').forEach(heading => {
                                heading.setAttribute('aria-expanded', 'true');
                                let el = heading.nextElementSibling;
                                const arrow = heading.querySelector('svg');
                                arrow.style.transform = '';
                                
                                while (el && el.tagName !== 'H2') {
                                  el.style.display = '';
                                  el = el.nextElementSibling;
                                }
                              });
                            }}
                            className="text-xs px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded border border-blue-500/20 transition-colors"
                          >
                            Expand All
                          </button>
                          <button 
                            onClick={() => {
                              // Collapse all sections
                              document.querySelectorAll('h2').forEach(heading => {
                                heading.setAttribute('aria-expanded', 'false');
                                let el = heading.nextElementSibling;
                                const arrow = heading.querySelector('svg');
                                arrow.style.transform = 'rotate(180deg)';
                                
                                while (el && el.tagName !== 'H2') {
                                  el.style.display = 'none';
                                  el = el.nextElementSibling;
                                }
                              });
                            }}
                            className="text-xs px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded border border-purple-500/20 transition-colors"
                          >
                            Collapse All
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="prose prose-invert max-w-none overflow-auto custom-scrollbar p-4 bg-gray-900/30 rounded-b-lg border border-t-0 border-white/5" style={{ maxHeight: '70vh' }}>
                      {activeTab === 'breakdown' ? (
                        renderMarkdown(assignment.analysis)
                      ) : (
                        <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">{assignment.analysis}</pre>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Click on section headers to expand/collapse</span>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="text-sm px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded border border-blue-500/20 transition-colors flex items-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy to Clipboard
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="space-y-6">
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500/10 to-transparent p-4 border-b border-white/10">
                      <h3 className="font-bold text-white">Assignment Info</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Uploaded</div>
                        <div className="text-lg font-medium text-white">
                          {new Date(assignment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">File Type</div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium text-white">
                            {assignment.fileName.split('.').pop().toUpperCase()}
                          </span>
                          {assignment.fileName.endsWith('.pdf') ? (
                            <span className="px-2 py-1 bg-red-500/20 rounded text-xs text-red-400">PDF</span>
                          ) : assignment.fileName.endsWith('.docx') ? (
                            <span className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-400">DOCX</span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-500/20 rounded text-xs text-gray-400">DOCUMENT</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Analysis by</div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium text-white">GPT-4</span>
                          <span className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-400">AI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500/10 to-transparent p-4 border-b border-white/10">
                      <h3 className="font-bold text-white">Actions</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <Link 
                        href="/upload" 
                        className="w-full px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm border border-blue-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload New Assignment
                      </Link>
                      <Link 
                        href="/dashboard" 
                        className="w-full px-4 py-3 bg-gray-800/50 hover:bg-gray-800/80 text-gray-300 rounded-lg text-sm border border-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Back to Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 my-8 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-bold text-yellow-500">Assignment Not Found</h3>
                <p className="text-gray-300 mt-1">We couldn't find the assignment you're looking for.</p>
                <Link 
                  href="/upload"
                  className="mt-4 inline-block px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm transition-colors"
                >
                  Upload a New Assignment
                </Link>
              </div>
            </div>
          </div>
        )}
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
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 1.5s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </main>
  );
} 