import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import UserProvider from '../providers/UserProveider';
import Provider from '@/providers/Provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Provider>
          <UserProvider>{children}</UserProvider>
        </Provider>
      </body>
    </html>
  );
}
