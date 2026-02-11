import { useAuth } from '@/features/auth/hooks/use-auth';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <div className="p-2">
      <LogOut
        className="h-[1.8rem] w-[1.8rem] cursor-pointer"
        onClick={logout}
      />
    </div>
  );
}
