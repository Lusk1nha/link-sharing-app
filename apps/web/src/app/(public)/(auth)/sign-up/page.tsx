import { RegisterUserForm } from '@/components/forms/register-user-form';
import { Card, CardContent, CardHeader } from '@link-sharing-app/ui/card';

import { Text } from '@link-sharing-app/ui/text';
import { Title } from '@link-sharing-app/ui/title';

export default function SignUpPage() {
  return (
    <Card className="gap-y-10">
      <CardHeader className='px-0 sm:px-10'>
        <Title>Create account</Title>
        <Text>Let’s get you started sharing your links!</Text>
      </CardHeader>

      <CardContent className="px-0 sm:px-10">
        <RegisterUserForm />
      </CardContent>
    </Card>
  );
}
