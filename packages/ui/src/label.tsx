import { cn } from '@link-sharing-app/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const labelVariants = cva('antialised', {
  variants: {
    variant: {
      default: 'text-label-default-text',
    },
    size: {
      default: 'text-preset-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (props, ref) => {
    const { children, className, variant, size, required, ...rest } = props;

    return (
      <div className="flex items-center gap-x-050">
        <label
          ref={ref}
          className={cn(labelVariants({ variant, size, className }))}
          {...rest}
        >
          {children}
        </label>

        {required && (
          <span className={cn('text-label-danger-text')} aria-hidden="true">
            *
          </span>
        )}
      </div>
    );
  },
);

Label.displayName = 'Label';

export { Label, labelVariants };
