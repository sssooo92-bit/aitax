import './globals.css';
import { JetBrains_Mono, Noto_Sans_KR } from 'next/font/google';

export const metadata = {
  title: 'ai세금',
  description: '세금 질문을 AI에게 물어보세요'
};

const sans = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const mono = JetBrains_Mono({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>{children}</body>
      <script
        // Set theme early to avoid flash.
        dangerouslySetInnerHTML={{
          __html: `
(() => {
  try {
    const key = 'aitax.theme.v1';
    const saved = localStorage.getItem(key);
    const theme = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();`
        }}
      />
    </html>
  );
}
