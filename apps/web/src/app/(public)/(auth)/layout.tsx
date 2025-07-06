import { Logo } from '@/components/logo/logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout(props: Readonly<AuthLayoutProps>) {
  const { children } = props;

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="max-w-[476px] w-full flex flex-col gap-y-18">
        <div className="flex items-center justify-start md:justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
