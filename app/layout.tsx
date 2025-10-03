
import './globals.css';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Cleanly – Marketplace usług sprzątania',
  description: 'Znajdź sprzątacza, opiekunkę lub złotą rączkę.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <div className="container">
          <nav className="nav">
            <Link className="brand" href="/">CLEANLY</Link>
            <div className="links">
              <Link href="/how-it-works">Jak to działa</Link>
              <Link href="/profiles">Profile</Link>
              <Link href="/login">Zaloguj</Link>
              <Link href="/register" className="button">Załóż konto</Link>
            </div>
          </nav>
          {children}
          <footer style={{marginTop:40,opacity:.8}} className="small">
            © {new Date().getFullYear()} Cleanly • Regulamin • Polityka prywatności
          </footer>
        </div>
      </body>
    </html>
  );
}
