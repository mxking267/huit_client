import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  ModalBody,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { useState } from 'react';
import { toast } from 'react-toastify';
import fetchWithAuth from '../hooks/fetchWithAuth';
import { DeleteIcon } from '../icons';

interface Props {
  facultyId: string;
}

const DeleteFaculty = ({ facultyId }: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleAccept() {
    setIsLoading(true);
    toast.dismiss();

    try {
      const result = await fetchWithAuth(`faculty/${facultyId}`, {
        method: 'DELETE',
      });
      if (!result) {
        toast.error('Server error');
        return;
      }

      toast.success('Delete success');
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <DeleteIcon onClick={onOpen} />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='top-center'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Delete faculty
              </ModalHeader>
              <ModalBody>
                <p>You are going to delete this faculty</p>
                <p>This action cannot be undone</p>
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
                  color='danger'
                  isLoading={isLoading}
                  onPress={handleAccept}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteFaculty;
