'use client';

import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { FormEvent } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/utils/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const queryClient = useQueryClient();

  // Cập nhật giá trị apiUrl để tránh lỗi null/undefined
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const loginMutation = useMutation({
    mutationFn: async (formData: { email: string; password: string }) => {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success('Login success');
        login(data.access_token);

        // Invalidate 'users' tag
        queryClient.invalidateQueries(['user-me']);

        // Redirect to events page
        router.push('/events');
      } else {
        toast.error('Wrong email or password');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    loginMutation.mutate({ email, password });
  };

  return (
    <div>
      <Card className='py-4'>
        <CardHeader className='pb-0 pt-2 px-4 flex-col items-center'>
          <Image
            alt='Card background'
            className='object-cover rounded-xl'
            src='https://media.licdn.com/dms/image/D560BAQGsW05QzpBVUQ/company-logo_200_200/0/1688537863377/huit_official_logo?e=2147483647&v=beta&t=N0b46EJB4iqWAQJuUbzdRBUS3GhE6_IuHNq1Wy8uqAI'
            width={60}
          />
          <h4 className='font-bold text-large'>Login</h4>
        </CardHeader>
        <CardBody className='overflow-visible py-2 min-w-[400px]'>
          <form
            className='space-y-4'
            onSubmit={onSubmit}
          >
            <Input
              label='Email'
              name='email'
              variant='flat'
            />
            <Input
              label='Password'
              name='password'
              type='password'
              variant='flat'
            />
            <Button
              className='w-full'
              color='primary'
              isLoading={loginMutation.isLoading}
              type='submit'
              variant='shadow'
            >
              Log in
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;
