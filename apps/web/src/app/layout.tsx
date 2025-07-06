import type { Metadata } from 'next';

import '@link-sharing-app/design-system/styles.css';
import '@link-sharing-app/ui/styles.css';
import './styles.css';
import { SystemProviders } from '@/components/system-providers/system-providers';

export const metadata: Metadata = {
  title: 'Link Sharing App',
  description: 'A simple app to share links with friends and family.',
  icons: {
    icon: '/assets/favicon-32x32.png',
    shortcut: '/assets/favicon-32x32.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SystemProviders>{children}</SystemProviders>
      </body>
    </html>
  );
}
