import { TemplateMap } from 'src/common/mail/domain/mail.port';

export enum AUTH_TEMPLATES {
  AUTH_WELCOME = 'auth-welcome',
  AUTH_LOGIN = 'auth-login',
}

export const AUTH_TEMPLATES_MAP: TemplateMap = {
  [AUTH_TEMPLATES.AUTH_WELCOME]: {
    name: AUTH_TEMPLATES.AUTH_WELCOME,
    subject: 'Welcome to our service!',
  },
  [AUTH_TEMPLATES.AUTH_LOGIN]: {
    name: AUTH_TEMPLATES.AUTH_LOGIN,
    subject: 'Login Notification',
  },
};
