import { api } from '@/lib/api';
import { LoginInput } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post('auth/login', data);

      return response.data;
    },
    onSuccess: (response) => {
      if (response.data.access_token) {
        Cookies.set('token', response.data.access_token, {
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
        });
      }

      toast.success(response.message);

      router.push('/');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || 'Erro inesperado.');
    },
  });

  const logout = () => {
    Cookies.remove('token');
    queryClient.clear();
    toast.success('Logout realizado com sucesso.');
    router.push('/login');
    router.refresh();
  };

  return {
    login,
    logout,
    isLoading: login.isPending,
  };
};
