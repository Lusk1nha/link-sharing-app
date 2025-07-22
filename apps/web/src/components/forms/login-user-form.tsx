'use client';

import {
  LoginUserFormSchema,
  LoginUserFormValues,
} from '@/shared/validations/login-user-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormGroup } from '@link-sharing-app/ui/form';

import { useForm } from 'react-hook-form';
import { TextInput } from '../inputs/text-input';
import { MailIcon } from '../icons/mail-icon';
import { PasswordInput } from '../inputs/password-input';
import { Button } from '@link-sharing-app/ui/button';
import Link from 'next/link';
import { Text } from '@link-sharing-app/ui/text';

export function LoginUserForm() {
  const form = useForm<LoginUserFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(LoginUserFormSchema),
  });

  async function onSubmit(data: LoginUserFormValues) {
    console.log('Form submitted:', data);
  }

  return (
    <Form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
      <FormGroup>
        <TextInput
          control={form.control}
          name="email"
          autoComplete="email"
          placeholder="e.g. john@example.com"
          label="Email address"
          required
        >
          <MailIcon />
        </TextInput>

        <PasswordInput
          control={form.control}
          name="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
        />
      </FormGroup>

      <Button type="submit">Login</Button>

      <Text className="text-center flex flex-col items-center justify-center sm:flex-row!">
        Don’t have an account?{' '}
        <Link href="/sign-up" className="text-anchor-text ml-1 hover:underline">
          Create account
        </Link>
      </Text>
    </Form>
  );
}
