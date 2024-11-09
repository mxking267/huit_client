import { Button } from '@nextui-org/button';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { getAccessToken } from '../utils/getAccessToken';

const RegisterEvent = ({ eventId }: { eventId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleRegister = async () => {
    setIsLoading(true);
    toast.dismiss();
    try {
      const res = await fetch(
        `http://127.0.0.1:8080/api/v1/event/register/${eventId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );
      toast.success('success');
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
      Register
    </Button>
  );
};

export default RegisterEvent;
