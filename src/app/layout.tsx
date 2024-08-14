import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import UserProvider from '../providers/UserProveider';
import Provider from '@/providers/Provider';
import { Pretendard } from '@/app/';
import { Montserrat } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const Pretendard = Pretendard({
  subsets: ['sans-serif'],
  display: 'swap'
});
const montserrat = Montserrat({
  subsets: ['latin'], // 필요한 서브셋을 지정합니다.
  weight: ['400', '700'], // 사용할 폰트 웨이트를 지정합니다.
  display: 'swap' // 폰트 로딩 방식을 지정합니다.
});

export const metadata: Metadata = {
  title: 'Health_Protecr_Me',
  description: 'Generated by create next app'
};

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
