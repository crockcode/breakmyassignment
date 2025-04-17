'use client';

import Link from 'next/link';

export default function LimitBanner({ recentUploads, isPro, className = "" }) {
  // If user is pro, don't show the banner
  if (isPro) return null;
  
  const uploadsRemaining = Math.max(0, 3 - recentUploads);
  const hasReachedLimit = uploadsRemaining === 0;
  
  return (
    <div className={`${className} w-full rounded-xl border ${hasReachedLimit ? 'bg-error/10 border-error/30' : 'bg-warning/10 border-warning/30'} p-4 md:p-6`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full ${hasReachedLimit ? 'bg-error/20' : 'bg-warning/20'} flex items-center justify-center shrink-0`}>
            {hasReachedLimit ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          
          <div>
            <h3 className={`text-lg font-bold ${hasReachedLimit ? 'text-error' : 'text-warning'}`}>
              {hasReachedLimit ? 'Upload Limit Reached' : 'Upload Limit Warning'}
            </h3>
            <p className={`text-base-content/80 mt-1 max-w-md`}>
              {hasReachedLimit
                ? "You've used all 3 of your free monthly uploads. Upgrade to Student Pro to continue analyzing assignments."
                : `You have ${uploadsRemaining} upload${uploadsRemaining !== 1 ? 's' : ''} remaining this month. Free accounts are limited to 3 uploads per month.`
              }
            </p>
          </div>
        </div>
        
        <div className="md:ml-auto">
          <Link
            href="/pricing"
            className={`btn ${hasReachedLimit ? 'btn-error' : 'btn-warning'}`}
          >
            Upgrade to Student Pro
          </Link>
        </div>
      </div>
    </div>
  );
} 