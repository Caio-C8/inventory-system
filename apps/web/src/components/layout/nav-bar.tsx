'use client';

import { useLogout } from '@/features/auth/hooks/use-logout';
import { Button } from '@/components/ui/button';

export default function NavBar() {
  const { logout } = useLogout();

  return (
    <Button variant="ghost" onClick={logout}>
      Sair
    </Button>
  );
}
