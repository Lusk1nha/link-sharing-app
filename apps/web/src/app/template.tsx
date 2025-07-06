import { Instrument_Sans } from 'next/font/google';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
});

interface RootTemplateProps {
  children: React.ReactNode;
}

export default function RootTemplate(props: Readonly<RootTemplateProps>) {
  const { children } = props;

  return (
    <div
      id="root-template-container"
      className={`bg-auth-background ${instrumentSans.className}`}
    >
      {children}
    </div>
  );
}
