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

const CreateCourse = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    try {
      const formData = new FormData(event.currentTarget);
      const courseId = formData.get('courseId') as string;
      const courseName = formData.get('courseName') as string;
      const startYear = formData.get('startYear') as string;
      const endYear = formData.get('endYear') as string;
      const result = await fetchWithAuth('course', {
        method: 'POST',
        body: JSON.stringify({ courseId, courseName, startYear, endYear }),
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
                  Create course
                </ModalHeader>
                <ModalBody>
                  <Input
                    label='Course ID'
                    name='courseId'
                    placeholder="Enter course's ID"
                    type='number'
                    variant='bordered'
                  />
                  <Input
                    label='Name'
                    name='courseName'
                    placeholder="Enter course's name"
                    variant='bordered'
                  />
                  <Input
                    label='Start year'
                    name='startYear'
                    placeholder="Enter course's year start"
                    type='number'
                    variant='bordered'
                  />
                  <Input
                    label='End year'
                    name='endYear'
                    placeholder="Enter course's year end"
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

export default CreateCourse;
