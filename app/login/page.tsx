'use client';

import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    // toast.dismiss();

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const response = await fetch(`http://127.0.0.1:8080/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!data) {
        toast.error('Server error');
        return;
      }
      if (data.EC === 0) {
        toast.success('Login success');
        localStorage.setItem('access_token', data.access_token);
        router.push('/');
      } else {
        toast.error('Wrong email or password');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

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
        <CardBody className='overflow-visible py-2  min-w-[400px]'>
          <form
            className='space-y-4'
            onSubmit={onSubmit}
          >
            <Input
              label='Email'
              name='email'
              variant={'flat'}
            />
            <Input
              label='Password'
              name='password'
              type='password'
              variant={'flat'}
            />
            <Button
              className='w-full'
              color='primary'
              isLoading={isLoading}
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
}
