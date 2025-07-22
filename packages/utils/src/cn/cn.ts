import { ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-preset-1',
        'text-preset-2',
        'text-preset-3-bold',
        'text-preset-3-semibold',
        'text-preset-3-regular',
        'text-preset-4',
      ],
      'font-weight': [
        'text-preset-1--font-weight',
        'text-preset-2--font-weight',
        'text-preset-3-bold--font-weight',
        'text-preset-3-semibold--font-weight',
        'text-preset-3-regular--font-weight',
        'text-preset-4--font-weight',
      ],
      leading: [
        'text-preset-1--line-height',
        'text-preset-2--line-height',
        'text-preset-3-bold--line-height',
        'text-preset-3-semibold--line-height',
        'text-preset-3-regular--line-height',
        'text-preset-4--line-height',
      ],
      tracking: [
        'text-preset-1--tracking',
        'text-preset-2--tracking',
        'text-preset-3-bold--tracking',
        'text-preset-3-semibold--tracking',
        'text-preset-3-regular--tracking',
        'text-preset-4--tracking',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
