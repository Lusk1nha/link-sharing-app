import { TemplateMap } from 'src/common/mail/domain/mail.port';

export const AUTH_TEMPLATES_MAP: TemplateMap = {
  'auth-welcome': {
    name: 'auth-welcome',
    subject: 'Welcome to our service!',
  },
  'auth-login': {
    name: 'auth-login',
    subject: 'Login Notification',
  },
};
