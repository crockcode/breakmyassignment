'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AssignmentDetail() {
  const params = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const sectionsPerPage = 3;

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        if (!params.id) throw new Error('Assignment ID is required');
        const response = await fetch(`/api/assignments/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch assignment');
        const data = await response.json();
        setAssignment(data.assignment);
      } catch (error) {
        console.error('Error fetching assignment:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [params.id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderMarkdown = (markdown) => {
    if (!markdown) return null;
    const safeLines = markdown.split('\n').filter(line => line.trim() !== '');
    return (
      <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-base-content">
        {safeLines.map((line, index) => (
          <p key={index} className="transition-opacity duration-300 ease-in-out opacity-0 animate-fadeInDelay" style={{ animationDelay: `${index * 0.05}s` }}>{line}</p>
        ))}
      </div>
    );
  };

  const extractSections = (analysis) => {
    if (!analysis) return [];
    const sectionPattern = /#+\s+(.*?)(?:\n[\s\S]*?)(?=#+\s+|$)/g;
    const sections = [];
    let match;
    while ((match = sectionPattern.exec(analysis)) !== null) {
      const title = match[1].trim();
      const content = match[0].replace(/#+\s+.*?\n/, '').trim();
      let type = 'info';
      if (/question|task|breakdown/i.test(title)) type = 'question';
      else if (/reference|resource/i.test(title)) type = 'reference';
      else if (/approach|suggestion/i.test(title)) type = 'approach';
      else if (/time|duration/i.test(title)) type = 'time';
      else if (/overview|summary/i.test(title)) type = 'overview';
      sections.push({ title, content, type });
    }
    return sections;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const sections = assignment ? extractSections(assignment.analysis) : [];
  const timeEstimate = sections.find(s => s.type === 'time')?.content || '1-2 hours';
  const paginatedSections = sections.slice(currentPage * sectionsPerPage, (currentPage + 1) * sectionsPerPage);
  const totalPages = Math.ceil(sections.length / sectionsPerPage);

  const getBadge = (type) => {
    const badgeStyles = {
      question: 'badge badge-primary',
      reference: 'badge badge-info',
      approach: 'badge badge-accent',
      time: 'badge badge-success',
      overview: 'badge badge-secondary',
      info: 'badge badge-neutral'
    };
    return badgeStyles[type] || badgeStyles.info;
  };

  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-ring loading-lg text-primary"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error shadow-lg">
            <div>
              <span>{error}</span>
            </div>
          </div>
        ) : assignment ? (
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-4xl font-bold text-primary mb-1">{assignment.fileName}</h1>
              <p className="text-sm text-base-content/70">Uploaded on {formatDate(assignment.createdAt)}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="stat bg-base-200 rounded-xl shadow-md">
                <div className="stat-title text-primary">Estimated Time</div>
                <div className="stat-value text-primary-content">⏱️ {timeEstimate}</div>
              </div>
              <div className="stat bg-base-200 rounded-xl shadow-md">
                <div className="stat-title text-secondary">Type</div>
                <div className="stat-value text-secondary-content">📝 {assignment.assignmentType || 'General'}</div>
              </div>
              <div className="stat bg-base-200 rounded-xl shadow-md">
                <div className="stat-title text-accent">Difficulty</div>
                <div className="stat-value text-accent-content">🎯 {assignment.difficulty || 'Moderate'}</div>
              </div>
              <div className="stat bg-base-200 rounded-xl shadow-md">
                <div className="stat-title text-info">Resources</div>
                <div className="stat-value text-info-content">📚 {sections.filter(s => s.type === 'reference').length}</div>
              </div>
            </div>

            <div className="space-y-6">
              {paginatedSections.map((section, index) => (
                <div key={index} className="card bg-base-100 border border-base-300 shadow transition-all duration-500 ease-in-out animate-fadeIn">
                  <div className="card-body">
                    <div className="flex justify-between items-center">
                      <h2 className="card-title text-lg md:text-xl text-primary font-bold">{section.title}</h2>
                      <span className={getBadge(section.type)}>{section.type}</span>
                    </div>
                    {renderMarkdown(section.content)}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                  className="btn btn-sm btn-outline"
                  disabled={currentPage === 0}
                >
                  ⬅ Prev
                </button>
                <span className="self-center text-sm">Page {currentPage + 1} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  className="btn btn-sm btn-outline"
                  disabled={currentPage === totalPages - 1}
                >
                  Next ➡
                </button>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Link href="/dashboard" className="btn btn-outline">⬅ Back to Dashboard</Link>
              <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-info">🔗 View File</a>
              <button
                onClick={() => copyToClipboard(assignment.analysis)}
                className={`btn ${copiedToClipboard ? 'btn-success' : 'btn-outline'}`}
              >
                {copiedToClipboard ? '✅ Copied!' : '📋 Copy Analysis'}
              </button>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning shadow-lg">
            <div>
              <span>Assignment not found.</span>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-fadeInDelay {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
