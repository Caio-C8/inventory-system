import { useLogout } from '@/features/auth/hooks/use-logout';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const { logout } = useLogout();

  return (
    <div className="p-2">
      <LogOut
        className="h-[1.8rem] w-[1.8rem] cursor-pointer"
        onClick={logout}
      />
    </div>
  );
}
