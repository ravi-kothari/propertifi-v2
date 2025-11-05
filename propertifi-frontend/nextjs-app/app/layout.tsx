import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { LayoutWrapper } from './LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Propertifi - AI-Powered Property Manager Matching',
  description: 'Find the perfect property manager for your rental properties. Compare verified professionals, access financial calculators, legal resources, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
