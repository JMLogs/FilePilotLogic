import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'File Processor',
  description: 'Process and analyze files with advanced preprocessing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}