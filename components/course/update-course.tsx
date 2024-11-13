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
import { Course } from '@/types/course';

interface Props {
  course: Course;
}

const UpdateCourse = ({ course }: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    try {
      const formData = new FormData(event.currentTarget);
      const courseName = formData.get('courseName') as string;
      const startYear = formData.get('startYear') as string;
      const endYear = formData.get('endYear') as string;
      const result = await fetchWithAuth(`course/${course._id}`, {
        method: 'PUT',
        body: JSON.stringify({ courseName, startYear, endYear }),
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
                  Update course
                </ModalHeader>
                <ModalBody>
                  <Input
                    label='Name'
                    name='courseName'
                    placeholder="Enter course's name"
                    variant='bordered'
                    defaultValue={course.courseName}
                  />
                  <Input
                    label='Start year'
                    name='startYear'
                    placeholder="Enter course's year start"
                    type='number'
                    variant='bordered'
                    defaultValue={course.startYear.toString()}
                  />
                  <Input
                    label='End year'
                    name='endYear'
                    placeholder="Enter course's year end"
                    type='number'
                    variant='bordered'
                    defaultValue={course.endYear.toString()}
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

export default UpdateCourse;
