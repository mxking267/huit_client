'use client';

import { Button } from '@nextui-org/button';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { getAccessToken } from '../utils/getAccessToken';
import fetchWithAuth from '../hooks/fetchWithAuth';

const RegisterEvent = ({ eventId }: { eventId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleRegister = async () => {
    setIsLoading(true);
    toast.dismiss();
    try {
      const res = await fetchWithAuth(`event/register/${eventId}`);
      if (res) toast.success('success');
      else toast.error('error');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      color='primary'
      isLoading={isLoading}
      radius='full'
      size='sm'
      variant='solid'
      onClick={handleRegister}
    >
      Đăng ký
    </Button>
  );
};

export default RegisterEvent;
