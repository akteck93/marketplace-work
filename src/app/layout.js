import './globals.css';

import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'Workiffy 3D Marketplace | Upwork-Grade Freelance Platform',
  description: 'Full-featured 3D Freelance Marketplace built with Next.js 15, React Three Fiber, and Stripe Escrow security.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
