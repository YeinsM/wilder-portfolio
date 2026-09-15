import type { Metadata } from 'next';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/manrope';
import './globals.css';
export const metadata: Metadata = {
  title: 'Wilder Mancera — Full Stack Developer',
  description:
    'Desarrollo full stack, soluciones empresariales y calidad de software. Explora los proyectos de Wilder Mancera.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
