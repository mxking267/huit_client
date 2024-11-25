import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { FormEvent, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import fetchWithAuth from '../hooks/fetchWithAuth';
import { getAccessToken } from '../utils/getAccessToken';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '@/types/user';
import { EditIcon } from '../icons';

const UpdateManager = ({ manager }: { manager: User }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const updateManager = async (updateData: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${apiUrl}/user/manager/${manager._id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updateData,
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.message || 'Lỗi khi cập nhật thông tin quản lý'
      );
    }

    return response.json();
  };

  const mutation = useMutation(updateManager, {
    onSuccess: () => {
      toast.success('Cập nhật người quản lý thành công!');
      setIsLoading(false);
      onClose();
      queryClient.invalidateQueries(['managers']);
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Đã xảy ra lỗi khi cập nhật';
      toast.error(errorMessage);
      setIsLoading(false);
    },
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    const formData = new FormData(event.currentTarget);

    const initialValues = {
      full_name: manager.full_name,
      email: manager.email,
    };

    const updatedData: any = {}; // Store changed fields here

    // Compare form data with initial values
    for (const [key, value] of formData.entries()) {
      // Only add to updatedData if the value is different from the initial value
      if (key in initialValues) {
        // Only add to updatedData if the value is different from the initial value
        if (value !== initialValues[key as keyof typeof initialValues]) {
          updatedData[key] = value;
        }
      }

      // Remove empty values from formData
      if (!value || value === '') {
        formData.delete(key); // Remove the key with empty value
      }
    }

    // If no fields have changed, don't make the API call
    if (Object.keys(updatedData).length === 0) {
      setIsLoading(false);
      onClose();
      return;
    }

    // Call API with the updated data
    mutation.mutate(updatedData);
  }

  return (
    <>
      <Button
        onPress={onOpen}
        variant='ghost'
      >
        <EditIcon />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='top-center'
      >
        <form
          className='space-y-4'
          onSubmit={onSubmit}
        >
          <ModalContent>
            <ModalHeader className='flex flex-col gap-1'>
              Cập nhật quản lý
            </ModalHeader>
            <ModalBody>
              <>
                <Input
                  label='Họ và tên'
                  name='full_name'
                  variant='bordered'
                  defaultValue={manager.full_name}
                />
                <Input
                  label='Email'
                  name='email'
                  variant='bordered'
                  defaultValue={manager.email}
                />
                <Input
                  label='Mật khẩu'
                  name='password'
                  variant='bordered'
                  type='password'
                />
              </>
            </ModalBody>
            <ModalFooter>
              <Button
                color='secondary'
                variant='flat'
                onPress={onClose}
              >
                Đóng
              </Button>
              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                Cập nhật
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default UpdateManager;
