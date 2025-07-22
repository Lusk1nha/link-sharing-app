import { LoginUserForm } from '@/components/forms/login-user-form';
import { Card, CardContent, CardHeader } from '@link-sharing-app/ui/card';

import { Text } from '@link-sharing-app/ui/text';
import { Title } from '@link-sharing-app/ui/title';

export default function SignInPage() {
  return (
    <Card className="gap-y-10">
      <CardHeader className="px-0 sm:px-10">
        <Title>Login</Title>
        <Text>Add your details below to get back into the app</Text>
      </CardHeader>

      <CardContent className="px-0 sm:px-10">
        <LoginUserForm />
      </CardContent>
    </Card>
  );
}
