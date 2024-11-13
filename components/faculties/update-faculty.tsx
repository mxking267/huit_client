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
import { EditIcon } from '../icons';
import { Faculty } from '@/types/faculty';

interface Props {
  faculty: Faculty;
}

const UpdateFaculty = ({ faculty }: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    try {
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const result = await fetchWithAuth(`faculty/${faculty._id}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });
      if (!result) {
        toast.error('Server error');
        return;
      }

      toast.success('Update success');
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <EditIcon onClick={onOpen} />
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
                  Update faculty
                </ModalHeader>
                <ModalBody>
                  <Input
                    label='Name'
                    placeholder="Enter faculty's name"
                    variant='bordered'
                    name='name'
                    defaultValue={faculty.name}
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
                    Update
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

export default UpdateFaculty;
