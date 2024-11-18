import { EEventStatus } from '@/types/event';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import fetchWithAuth from './fetchWithAuth';

// Hook cập nhật trạng thái
export const useUpdateEventStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: EEventStatus;
    }) => {
      const response = await fetchWithAuth(`event/${id}/status`, {
        body: JSON.stringify({ status }),
        method: 'PUT',
      });

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['events']);
      toast.success('Success');
      console.log('Event updated successfully:', data);
    },
    onError: (error) => {
      console.error('Error updating event status:', error);
      toast.error(error + '');
    },
  });
};
