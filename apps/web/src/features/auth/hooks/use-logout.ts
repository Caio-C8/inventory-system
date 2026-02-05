import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = () => {
    Cookies.remove('token');
    queryClient.clear();
    router.push('/login');
    router.refresh();
    toast.success('Logout realizado com sucesso.');
  };

  return { logout };
};
