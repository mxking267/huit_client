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
import { Select, SelectItem } from '@nextui-org/select';
import { getAccessToken } from '../utils/getAccessToken';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Faculty } from '@/types/faculty';
import { Course } from '@/types/course';

const fetchFaculty = async () => {
  const [faculties, courses] = await Promise.all([
    fetchWithAuth(`faculty/all`),
    fetchWithAuth(`course/all`),
  ]);
  return { faculties, courses };
};

const CreateUser = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data, isLoading: isFetching } = useQuery(['faculties'], fetchFaculty);

  const createUser = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const student_code = formData.get('student_code') as string;
    const class_name = formData.get('class_name') as string;
    const full_name = formData.get('full_name') as string;
    const faculty_id = formData.get('faculty_id') as string;
    const course_id = formData.get('course_id') as string;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/user`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        student_code,
        class_name,
        full_name,
        faculty_id,
        course_id,
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json(); // Lấy chi tiết lỗi từ API

      // Xử lý các lỗi cụ thể dựa trên mã trạng thái
      switch (response.status) {
        case 400: // Lỗi do dữ liệu không hợp lệ
          throw new Error(
            errorResponse.message || 'Dữ liệu gửi lên không hợp lệ!'
          );
        case 401: // Lỗi do chưa đăng nhập hoặc token không hợp lệ
          throw new Error('Bạn không có quyền thực hiện thao tác này.');
        case 404: // API hoặc tài nguyên không tồn tại
          throw new Error('Không tìm thấy tài nguyên.');
        case 500: // Lỗi từ server
          throw new Error('Lỗi máy chủ. Vui lòng thử lại sau.');
        default: // Các lỗi khác
          throw new Error(
            errorResponse.message || 'Đã xảy ra lỗi không xác định.'
          );
      }
    }

    return response.json();
  };

  const mutation = useMutation(createUser, {
    onSuccess: () => {
      toast.success('Tạo người dùng thành công!');
      setIsLoading(false);

      onClose();
      queryClient.invalidateQueries(['users']);
    },
    onError: (error: any) => {
      const errorMessage =
        error.message || 'Đã xảy ra lỗi trong quá trình tạo người dùng';
      toast.error(errorMessage);
      setIsLoading(false);
    },
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    const formData = new FormData(event.currentTarget);

    for (const [key, value] of formData.entries()) {
      if (!value || value === '') {
        formData.delete(key); // Xóa các key có giá trị trống
      }
    }

    mutation.mutate(formData);
  }

  if (isFetching) {
    return <p>Loading...</p>;
  }

  const { faculties = [], courses = [] } = data || {};

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
                  Tạo người dùng
                </ModalHeader>
                <ModalBody>
                  <Input
                    label='Mã sinh viên'
                    name='student_code'
                    variant='bordered'
                    isRequired
                  />
                  <Input
                    label='Họ và tên'
                    name='full_name'
                    variant='bordered'
                    isRequired
                  />
                  <Input
                    label='Email'
                    name='email'
                    variant='bordered'
                    isRequired
                  />
                  <Input
                    label='Mật khẩu'
                    name='password'
                    variant='bordered'
                    isRequired
                  />
                  <Input
                    label='Lớp'
                    name='class_name'
                    variant='bordered'
                    isRequired
                  />
                  <Select
                    label='Khoa'
                    name='faculty_id'
                    variant='bordered'
                    isRequired
                  >
                    {faculties.map((item: Faculty) => (
                      <SelectItem
                        value={item._id}
                        key={item._id}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label='Khoá'
                    name='course_id'
                    variant='bordered'
                    isRequired
                  >
                    {courses.map((item: Course) => (
                      <SelectItem
                        value={item._id}
                        key={item._id}
                      >
                        {item.courseName}
                      </SelectItem>
                    ))}
                  </Select>
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

export default CreateUser;
