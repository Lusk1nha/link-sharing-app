import { Card, CardContent, CardHeader } from '@link-sharing-app/ui/card';

export default function SignUpPage() {
  return (
    <Card className='gap-y-10'>
      <CardHeader>
        <h1 className='sm:system-preset-2 md:system-preset-1'>Create account</h1>
        <p className='system-preset-3-regular'>Let’s get you started sharing your links!</p>
      </CardHeader>
      <CardContent>
        <p>Please fill in the form to create a new account.</p>
      </CardContent>
    </Card>
  );
}
