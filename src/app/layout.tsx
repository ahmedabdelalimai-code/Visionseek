import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VisionSeek OS',
  description: 'Integrated Strategic Opportunity Intelligence & Venture Creation Operating System.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html suppressHydrationWarning><body>{children}</body></html>;
}
