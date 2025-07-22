import * as React from 'react';
import { cn } from '@link-sharing-app/utils/cn';

import { Label as LabelComp, LabelProps } from './label';

interface InputContextValue {
  hasError: boolean;
}
const InputContext = React.createContext<InputContextValue | null>(null);

interface InputWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

const Wrapper = React.forwardRef<HTMLDivElement, InputWrapperProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

interface InputRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hasError?: boolean;
}

const Root = React.forwardRef<HTMLDivElement, InputRootProps>(
  ({ children, className, hasError = false, ...props }, ref) => {
    const contextValue = React.useMemo(() => ({ hasError }), [hasError]);

    return (
      <InputContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="input-root"
          className={cn(
            `h-14 flex items-center gap-4 border rounded-8 px-4 py-4 text-preset-3-regular`,
            hasError
              ? 'border-input-border-error focus-within:border-input-border-error'
              : 'border-input-border focus-within:border-input-border',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </InputContext.Provider>
    );
  },
);
Root.displayName = 'Input.Root';

interface InputLabelProps extends LabelProps {
  children: React.ReactNode;
  className?: string;
  hasError?: boolean;
}
const Label = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ children, className, hasError, ...props }, ref) => {
    return (
      <LabelComp
        ref={ref}
        data-slot="input-label"
        className={cn(className, hasError && 'text-input-error-text')}
        {...props}
      >
        {children}
      </LabelComp>
    );
  },
);

interface InputIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}
const Icon = React.forwardRef<HTMLSpanElement, InputIconProps>(
  ({ children, className, ...props }, ref) => (
    <span
      data-slot="input-icon"
      ref={ref}
      className={cn(
        'hidden min-[400px]:flex h-4 w-4 items-center justify-center text-input-icon',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  ),
);
Icon.displayName = 'Input.Icon';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Field = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(InputContext);

    if (!context) {
      console.error('Input.Field must be used within Input.Root');
      return null;
    }

    return (
      <input
        ref={ref}
        data-slot="input-field"
        className={cn(
          'flex-1 bg-transparent outline-none text-input-text placeholder:text-input-placeholder/50',
          className,
        )}
        {...props}
      />
    );
  },
);
Field.displayName = 'Input.Field';

interface InputErrorProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}
const InputError = React.forwardRef<HTMLSpanElement, InputErrorProps>(
  ({ children, className, ...props }, ref) => {
    const context = React.useContext(InputContext);

    if (!context) {
      console.error('Input.Error must be used within Input.Root');
      return null;
    }

    if (!context.hasError) return null;

    return (
      <span
        ref={ref}
        data-slot="input-error"
        className={cn(
          `flex items-center justify-center text-input-error-text text-preset-4`,
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);
InputError.displayName = 'Input.Error';

interface InputDescriptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

const Description = React.forwardRef<HTMLSpanElement, InputDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="input-description"
        className={cn(
          `flex items-center text-input-description-text text-preset-4`,
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

export const Input = {
  Wrapper,
  Label,
  Root,
  Icon,
  Field,
  InputError,
  Description,
};
