
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Propertifi',
  description: 'Property Management Solutions',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://www.propertifi.com/',
    siteName: 'Propertifi',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
