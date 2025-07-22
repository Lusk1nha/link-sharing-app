'use client';

import { Label } from '@link-sharing-app/ui/label';
import { Form, FormGroup } from '@link-sharing-app/ui/form';

import { TextInput } from '../inputs/text-input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { MailIcon } from '../icons/mail-icon';
import { PasswordInput } from '../inputs/password-input';
import { Input } from '@link-sharing-app/ui/input';
import { Button } from '@link-sharing-app/ui/button';
import { Text } from '@link-sharing-app/ui/text';
import Link from 'next/link';
import {
  RegisterUserFormSchema,
  RegisterUserFormValues,
} from '@/shared/validations/register-user-validation';

export function RegisterUserForm() {
  const form = useForm<RegisterUserFormValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(RegisterUserFormSchema),
  });

  async function onSubmit(data: RegisterUserFormValues) {
    console.log('Form submitted:', data);
  }

  return (
    <Form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
      <FormGroup>
        <TextInput
          control={form.control}
          name="email"
          autoComplete="email"
          placeholder="e.g. alex@email.com"
          label="Email address"
          required
        >
          <MailIcon />
        </TextInput>

        <PasswordInput
          control={form.control}
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          label="Create password"
          required
        />

        <PasswordInput
          control={form.control}
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          required
        />
      </FormGroup>

      <Button type="submit">Create new account</Button>

      <Text className="text-center flex flex-col items-center justify-center sm:flex-row!">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-anchor-text ml-1 hover:underline">
          Login
        </Link>
      </Text>
    </Form>
  );
}
