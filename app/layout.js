import { Inter } from 'next/font/google'
import './globals.css'
import AppAuthProvider from '@/providers/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Toaster from '@/components/Toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BreakMyAssignment | AI-Powered Assignment Analysis',
  description: 'Get your assignments broken down into manageable steps with AI analysis',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppAuthProvider>
          <div className="min-h-screen flex flex-col bg-[#171923] text-gray-100 relative overflow-hidden">
            {/* Background gradient effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-500 opacity-10 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600 opacity-10 rounded-full filter blur-3xl"></div>
            </div>
            
            <Navbar />
            
            <main className="flex-grow px-4 pt-20 pb-8">
              <div className="max-w-7xl mx-auto w-full relative z-10">
                {children}
              </div>
            </main>
            
            <Footer />
            <Toaster />
          </div>
        </AppAuthProvider>
      </body>
    </html>
  )
}