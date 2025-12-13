import './globals.css';

export const metadata = {
  title: 'ai세금',
  description: '세금 질문을 AI에게 물어보세요'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
