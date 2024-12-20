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
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import fetchWithAuth from '../hooks/fetchWithAuth';

const CreateLocation = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    try {
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const address = formData.get('address') as string;
      const capacity = formData.get('capacity') as string;
      const result = await fetchWithAuth('location', {
        method: 'POST',
        body: JSON.stringify({ name, address, capacity }),
      });
      if (!result) {
        toast.error('Server error');
        return;
      }

      toast.success('Create success');
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <Button
        onPress={onOpen}
        color='primary'
      >
        Tạo mới
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
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  Tạo địa điểm
                </ModalHeader>
                <ModalBody>
                  <Input
                    label='Tên địa điểm'
                    name='name'
                    variant='bordered'
                    isRequired
                  />
                  <Input
                    label='Địa chỉ'
                    name='address'
                    variant='bordered'
                    isRequired
                  />
                  <Input
                    label='Sức chứa'
                    name='capacity'
                    type='number'
                    variant='bordered'
                    isRequired
                  />
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
                    Tạo
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default CreateLocation;
