import type { Metadata } from 'next';
import { Inter, Newsreader, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-ui' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-editorial' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'StorySpec AI — Quiet Intelligence',
  description: 'AI-driven browser testing tool.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}>
        <div id="app">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <span className="material-icons-round">graphic_eq</span>
        </div>
        <div>
          <span className="brand-name">StorySpec AI</span>
          <span className="brand-sub">Quiet Intelligence</span>
        </div>
      </div>
      <div className="sidebar-nav">
        <Link href="/" className="nav-item">
          <span className="material-icons-round">dashboard</span> Dashboard
        </Link>
        <Link href="/runs/new" className="nav-item">
          <span className="material-icons-round">play_circle</span> New Run
        </Link>
      </div>
      <div className="sidebar-footer">
        <div className="status-indicator">
          <div className="dot running"></div> Core Systems
        </div>
      </div>
    </nav>
  );
}
