import * as z from 'zod';

export const LoginUserFormSchema = z.object({
  email: z.email({
    error: (issue) => {
      return issue.input === null || issue.input === ''
        ? 'Can’t be empty'
        : 'Invalid email address';
    },
  }),

  password: z.string().min(8, 'Please check again').nonempty('Can’t be empty'),
});

export type LoginUserFormValues = z.infer<typeof LoginUserFormSchema>;
