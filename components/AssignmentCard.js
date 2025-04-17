import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function AssignmentCard({ assignment }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get timestamp from MongoDB ObjectId
  const timestamp = assignment._id.toString().substring(0, 8);
  const date = new Date(parseInt(timestamp, 16) * 1000);
  
  // Format the date to relative time
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  
  // Truncate the title if it's too long
  const truncateTitle = (title, maxLength = 60) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };
  
  // Calculate percentage score and determine color
  const score = assignment.score || 0;
  const scoreColor = score < 70 
    ? 'text-red-500' 
    : score < 85 
      ? 'text-amber-500' 
      : 'text-emerald-500';
  
  return (
    <div
      className="group relative bg-[#1E2030] border border-gray-800 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/30 hover:translate-y-[-4px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Progress indicator at the top of card */}
      <div className="w-full h-1 bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 text-xs font-medium rounded-md ${scoreColor} bg-${scoreColor.split('-')[1]}-500/10`}>
              {score}% Similarity
            </div>
            <div className="px-2 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-400">
              {assignment.fileType || 'Document'}
            </div>
          </div>
          <div className="text-gray-400 text-xs">{timeAgo}</div>
        </div>
        
        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
          {truncateTitle(assignment.title || 'Untitled Assignment')}
        </h3>
        
        <p className="text-gray-400 text-sm mb-5 line-clamp-2">
          {assignment.summary || 'No summary available for this assignment.'}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <span>{assignment.plagiarismCount || 0} matches</span>
          </div>
          
          <Link 
            href={`/results/${assignment._id}`}
            className="relative inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium transition-all duration-300 overflow-hidden group-hover:bg-blue-500 group-hover:text-white"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              View Results
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
      
      {/* Decorative gradient light effect on hover */}
      <div 
        className={`absolute -inset-[1px] bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 rounded-xl transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-20' : ''}`} 
      />
    </div>
  );
} 