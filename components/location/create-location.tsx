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
        Create
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
                  Create location
                </ModalHeader>
                <ModalBody>
                  <Input
                    label='Name'
                    name='name'
                    placeholder="Enter location's name"
                    variant='bordered'
                  />
                  <Input
                    label='Address'
                    name='address'
                    placeholder="Enter location's address"
                    variant='bordered'
                  />
                  <Input
                    label='Capacity'
                    name='capacity'
                    placeholder="Enter location's capacity"
                    type='number'
                    variant='bordered'
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color='secondary'
                    variant='flat'
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    color='primary'
                    isLoading={isLoading}
                    type='submit'
                  >
                    Create
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
