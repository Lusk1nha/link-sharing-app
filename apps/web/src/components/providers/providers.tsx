'use client';

import { ThemeProvider } from '@/providers/theme-provider';
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers(props: Readonly<ProvidersProps>) {
  const { children } = props;

  return (
    <ThemeProvider storageKey="theme" defaultTheme="system">
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
