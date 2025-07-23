import * as z from 'zod';

export const RegisterUserFormSchema = z
  .object({
    email: z.email({
      error: (issue) => {
        return issue.input === null || issue.input === ''
          ? 'Can’t be empty'
          : 'Invalid email address';
      },
    }),

    password: z.string('Can’t be empty').min(8, {
      message: 'Please check again',
    }),

    confirmPassword: z.string('Can’t be empty').min(8, {
      message: 'Please check again',
    }),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: 'Do not match',
    path: ['confirmPassword'],
  });

export type RegisterUserFormValues = z.infer<typeof RegisterUserFormSchema>;
