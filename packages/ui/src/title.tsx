import { cn } from '@link-sharing-app/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const titleVariants = cva('antialiased', {
  variants: {
    variant: {
      default: 'text-title-default-text',
    },
    size: {
      xl: 'text-preset-2 md:text-preset-1',
      lg: 'text-preset-2',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'xl',
  },
});

export interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  className?: string;
  active?: boolean;
}

const Title = forwardRef<HTMLHeadingElement, TitleProps>((props, ref) => {
  const { size, className, variant, active, children, title, ...rest } = props;

  const computedTitle =
    title ?? (typeof children === 'string' ? children : undefined);

  return (
    <h1
      data-component="Title"
      ref={ref}
      className={cn(titleVariants({ variant, size, className }))}
      data-state={active ? 'active' : undefined}
      title={computedTitle}
      {...(title ? { 'aria-label': title } : {})}
      {...rest}
    >
      {children}
    </h1>
  );
});

Title.displayName = 'Title';

export { Title, titleVariants };
