import { cn } from '@link-sharing-app/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-8 cursor-pointer focus:outline-none focus:ring-2 ring-offset-2 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-button-default text-button-default-text rounded-8',
      },
      size: {
        default:
          'py-4 px-6 text-preset-3-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, variant, size, ...rest } = props;

  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...rest}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
