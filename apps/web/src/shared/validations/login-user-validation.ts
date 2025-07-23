import * as z from 'zod';

export const LoginUserFormSchema = z.object({
  email: z.email({
    error: (issue) => {
      return issue.input === null || issue.input === ''
        ? 'Can’t be empty'
        : 'Invalid email address';
    },
  }),

  password: z.string('Can’t be empty').min(8, 'Please check again'),
});

export type LoginUserFormValues = z.infer<typeof LoginUserFormSchema>;
