'use client';

import { Form, FormGroup } from '@link-sharing-app/ui/form';

import { TextInput } from '../inputs/text-input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { MailIcon } from '../icons/mail-icon';

import { Button } from '@link-sharing-app/ui/button';
import { Text } from '@link-sharing-app/ui/text';
import Link from 'next/link';
import {
  RegisterUserFormSchema,
  RegisterUserFormValues,
} from '@/shared/validations/register-user-validation';
import { LockIcon } from '../icons/lock-icon';
import { useRouter } from 'next/navigation';

export function RegisterUserForm() {
  const router = useRouter();

  const form = useForm<RegisterUserFormValues>({
    defaultValues: {
      email: 'lucaspedro517@gmail.com',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(RegisterUserFormSchema),
  });

  async function onSubmit(payload: RegisterUserFormValues) {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Registration failed. Please check your details.');
    }

    router.push('/sign-in');
  }

  return (
    <Form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
      <FormGroup>
        <TextInput
          control={form.control}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="e.g. alex@email.com"
          label="Email address"
          icon={<MailIcon />}
          required
        />

        <TextInput
          control={form.control}
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          label="Create password"
          icon={<LockIcon />}
          required
        />

        <TextInput
          control={form.control}
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          label="Confirm password"
          description="Password must contain at least 8 characters"
          icon={<LockIcon />}
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
