import { Logo } from '@/components/logo/logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout(props: Readonly<AuthLayoutProps>) {
  const { children } = props;

  return (
    <div className="flex w-full h-screen bg-auth-background-mobile sm:bg-auth-background  items-start sm:items-center! justify-center px-8 py-8">
      <div className="max-w-[476px] w-full flex flex-col gap-y-16 sm:gap-y-8">
        <div className="flex items-center justify-start sm:justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
