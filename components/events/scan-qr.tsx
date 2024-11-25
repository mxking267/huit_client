'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Html5QrcodePlugin from '@/config/Html5QrCodePlugin';
import { toast } from 'react-toastify';
import { getAccessToken } from '../utils/getAccessToken';

interface Props {
  eventId: string;
}

const QRScanner = ({ eventId }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const queryClient = useQueryClient();

  const checkInOutMutation = useMutation(
    async ({
      userId,
      eventId,
      usedFor,
    }: {
      userId: string;
      eventId: string;
      usedFor: string;
    }) => {
      const response = await fetch(`${apiUrl}/event/check-in-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ userId, eventId, usedFor }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error');
      }

      return result;
    },
    {
      onSuccess: () => {
        toast.success('Check-in/out success');
        queryClient.refetchQueries(['attendance']);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Something went wrong');
      },
    }
  );

  async function onScanSuccess(decodedText: string, decodedResult: any) {
    const data = JSON.parse(decodedText);
    const userId = data.userId;
    const usedFor = data.usedFor;

    if (decodedText) {
      checkInOutMutation.mutate({ userId, eventId, usedFor });
    }
  }

  return (
    <Html5QrcodePlugin
      fps={10}
      qrbox={250}
      disableFlip={true}
      qrCodeSuccessCallback={onScanSuccess}
      verbose={true}
    />
  );
};

export default QRScanner;
