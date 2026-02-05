import { api } from '@/lib/api';
import { LoginInput } from '@repo/types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post('auth/login', data);

      return response.data;
    },
    onSuccess: (data) => {
      if (data.access_token) {
        Cookies.set('token', data.access_token, {
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
        });
      }

      toast.success(data.message);

      router.push('/');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || 'Erro inesperado.');
    },
  });
};
