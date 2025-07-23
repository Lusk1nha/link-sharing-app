'use client';

import React, { useId, useCallback, ReactNode } from 'react';
import { Input, InputFieldProps } from '@link-sharing-app/ui/input';
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormStateReturn,
} from 'react-hook-form';

interface TextInputProps<T extends FieldValues> extends InputFieldProps {
  name: Path<T>;
  control: Control<T>;
  icon?: ReactNode;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
}

interface InputControllerRenderProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<T>;
}

export function TextInput<T extends FieldValues>(
  props: Readonly<TextInputProps<T>>,
) {
  const {
    name,
    control,
    icon,
    label,
    placeholder = '',
    description = '',
    required = false,
    ...fieldProps
  } = props;

  const id = useId();

  const renderFn = useCallback(
    ({ field, fieldState }: InputControllerRenderProps<T>) => {
      const hasError = Boolean(fieldState.error);
      const errorMessage = fieldState.error?.message;

      return (
        <Input.Wrapper hasError={hasError}>
          {label && (
            <Input.Label htmlFor={id} required={required} hasError={hasError}>
              {label}
            </Input.Label>
          )}

          <Input.Root>
            {icon && <Input.Icon>{icon}</Input.Icon>}

            <div className="flex-1 flex gap-x-4">
              <Input.Field
                id={id}
                name={field.name}
                value={field.value || ''}
                onChange={field.onChange}
                placeholder={placeholder}
                aria-describedby={
                  description || errorMessage ? `${id}-desc` : undefined
                }
                aria-invalid={hasError || undefined}
                aria-required={required || undefined}
                {...fieldProps}
              />

              {hasError && (
                <Input.InputError className="hidden sm:flex!">
                  {errorMessage}
                </Input.InputError>
              )}
            </div>
          </Input.Root>

          {(description || hasError) && (
            <div
              className="flex flex-wrap items-center justify-between gap-x-2"
              id={`${id}-desc`}
            >
              {description && (
                <Input.Description>{description}</Input.Description>
              )}
              {hasError && (
                <Input.InputError className="sm:!hidden">
                  {errorMessage}
                </Input.InputError>
              )}
            </div>
          )}
        </Input.Wrapper>
      );
    },
    [id, icon, label, placeholder, description, required],
  );

  return <Controller name={name} control={control} render={renderFn} />;
}
