import type { Metadata } from 'next';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/manrope';
import './globals.css';
export const metadata: Metadata = {
  title: 'Wilder Mancera — Full Stack Developer',
  description:
    'Full stack development, enterprise solutions, and software quality. Explore Wilder Mancera’s projects.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
