import './globals.css';

export const metadata = {
  title: 'رشد — همراه توسعه فردی',
  description: 'اپ مدیریت تسک، برنامه‌ریزی، عادت‌ها، اهداف و یادداشت روزانه',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
