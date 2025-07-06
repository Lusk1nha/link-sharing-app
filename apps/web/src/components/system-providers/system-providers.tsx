import { ThemeProvider } from '@/providers/theme-provider';

interface SystemProviderProps {
  children: React.ReactNode;
}

export function SystemProviders(props: Readonly<SystemProviderProps>) {
  const { children } = props;

  return (
    <ThemeProvider storageKey="theme" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}
