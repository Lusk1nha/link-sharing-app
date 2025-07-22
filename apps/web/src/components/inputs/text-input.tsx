'use client';

import { Input } from '@link-sharing-app/ui/input';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface TextInputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  control: Control<T>;

  children: React.ReactNode;

  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
}

export function TextInput<T extends FieldValues>(
  props: Readonly<TextInputProps<T>>,
) {
  const {
    name,
    label,
    placeholder,
    description,
    required,
    children,
    ...fieldProps
  } = props;

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
            <Input.Icon>{children}</Input.Icon>

            <div className="flex-1 flex gap-x-4">
              <Input.Field
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
