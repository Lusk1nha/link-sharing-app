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

import { Button } from '@link-sharing-app/ui/button';
import Link from 'next/link';
import { Text } from '@link-sharing-app/ui/text';
import { LockIcon } from '../icons/lock-icon';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function LoginUserForm() {
  const router = useRouter();

  const form = useForm<LoginUserFormValues>({
    defaultValues: {
      email: 'lucaspedro517@gmail.com',
      password: 'teste123456789',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(LoginUserFormSchema),
  });

  async function onSubmit(payload: LoginUserFormValues) {
    const response = await signIn('credentials', {
      redirect: false,
      email: payload.email,
      password: payload.password,
    });

    if (!response?.ok) {
      console.error('Login failed:', response?.error);
      throw new Error('Login failed. Please check your credentials.');
    }

    router.push('/');
  }

  return (
    <Form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
      <FormGroup>
        <TextInput
          control={form.control}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="e.g. john@example.com"
          label="Email address"
          icon={<MailIcon />}
          required
        />

        <TextInput
          control={form.control}
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          label="Password"
          icon={<LockIcon />}
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
