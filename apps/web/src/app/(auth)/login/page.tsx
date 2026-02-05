import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="p-5 w-100">
        <LoginForm />
      </Card>
    </div>
  );
}
