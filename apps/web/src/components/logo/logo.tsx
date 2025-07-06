import { LogoIcon } from '../icons/logo-icon';
import { LogoNameIcon } from '../icons/logo-name-icon';

export function Logo() {
  return (
    <span
      title="Logo of Link Sharing App"
      className="flex items-center gap-x-2"
    >
      <LogoIcon className="text-logo-icon" />
      <LogoNameIcon className="text-logo-name" />
    </span>
  );
}
