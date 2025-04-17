'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }) {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#171923] text-gray-100 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-500 opacity-10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600 opacity-10 rounded-full filter blur-3xl"></div>
      </div>
      
      <Navbar />
      
      <main className={`flex-grow px-4 pt-20 pb-8 transition-opacity duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          {children}
        </div>
      </main>
      
      <Footer />
      
      {/* Toast notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
} 