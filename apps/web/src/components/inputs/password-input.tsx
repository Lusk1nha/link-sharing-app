'use client';

import { Input } from '@link-sharing-app/ui/input';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { LockIcon } from '../icons/lock-icon';

interface PasswordInputProps<T extends FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: Path<T>;
  control: Control<T>;

  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
}

export function PasswordInput<T extends FieldValues>(
  props: Readonly<PasswordInputProps<T>>,
) {
  const { name, label, placeholder, description, required, ...fieldProps } =
    props;

  return (
    <Controller
      name={name}
      control={props.control}
      render={({ field, fieldState }) => (
        <Input.Wrapper>
          {label && (
            <Input.Label required={required} hasError={fieldState.invalid}>
              {label}
            </Input.Label>
          )}

          <Input.Root hasError={fieldState.invalid}>
            <Input.Icon>
              <LockIcon />
            </Input.Icon>

            <div className="flex-1 flex gap-x-4">
              <Input.Field
                type="password"
                name={field.name}
                value={field.value || ''}
                onChange={field.onChange}
                placeholder={placeholder}
                {...fieldProps}
              />
              <Input.InputError className="hidden sm:flex!">
                {fieldState.error?.message}
              </Input.InputError>
            </div>
          </Input.Root>

          <Input.Description>{description}</Input.Description>
        </Input.Wrapper>
      )}
    />
  );
}
