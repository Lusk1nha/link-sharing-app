import { cn } from '@link-sharing-app/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const textVariants = cva('antialiased', {
  variants: {
    variant: {
      default: 'text-default-text',
    },
    size: {
      default: 'text-preset-3-regular',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  className?: string;
  active?: boolean;
}

const Text = forwardRef<HTMLParagraphElement, TextProps>((props, ref) => {
  const { size, className, variant, active, title, children, ...rest } = props;

  const computedTitle =
    title ?? (typeof children === 'string' ? children : undefined);

  return (
    <p
      data-component="Text"
      ref={ref}
      className={cn(
        textVariants({
          size,
          variant,
          className,
        }),
      )}
      data-state={active ? 'active' : undefined}
      title={computedTitle}
      {...(title ? { 'aria-label': title } : {})}
      {...rest}
    >
      {children}
    </p>
  );
});

Text.displayName = 'Text';

export { Text, textVariants };
