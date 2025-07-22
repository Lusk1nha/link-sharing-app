import * as React from 'react';
import { cn } from '@link-sharing-app/utils/cn';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      />
    );
  },
);
Form.displayName = 'Form';

const FormGroup = React.forwardRef<
  HTMLFieldSetElement,
  React.HTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => {
  return (
    <fieldset
      ref={ref}
      className={cn('flex flex-col gap-y-6', className)}
      {...props}
    />
  );
});
FormGroup.displayName = 'FormGroup';

export { Form, FormGroup };
