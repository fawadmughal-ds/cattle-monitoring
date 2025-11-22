import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Cattle Monitoring Dashboard',
  description: 'AI-powered cattle health monitoring system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto pt-16 lg:pt-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

