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
import { Select, SelectItem } from '@nextui-org/select';
import { getAccessToken } from '../utils/getAccessToken';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Faculty } from '@/types/faculty';
import { Course } from '@/types/course';
import { EditIcon } from '../icons';
import { User } from '@/types/user';

const fetchFaculty = async () => {
  const [faculties, courses] = await Promise.all([
    fetchWithAuth(`faculty/all`),
    fetchWithAuth(`course/all`),
  ]);
  return { faculties, courses };
};

const UpdateUser = ({ user }: { user: User }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data, isLoading: isFetching } = useQuery(['faculties'], fetchFaculty);

  const updateUser = async (updateData: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/user/${user._id}`, {
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

  const mutation = useMutation(updateUser, {
    onSuccess: () => {
      toast.success('Cập nhật người dùng thành công!');
      setIsLoading(false);

      onClose();
      queryClient.invalidateQueries(['users']);
    },
    onError: (error: any) => {
      const errorMessage =
        error.message || 'Đã xảy ra lỗi trong quá trình cập nhật người dùng';
      toast.error(errorMessage);
      setIsLoading(false);
    },
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    const formData = new FormData(event.currentTarget);

    // Track initial values to compare
    const initialValues = {
      email,
      student_code,
      full_name,
      class_name,
      faculty_id,
      course_id,
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

  const { faculties = [], courses = [] } = data || {};
  const { email, student_code, full_name, class_name, faculty_id, course_id } =
    user || {};

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
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  Cập nhật người dùng
                </ModalHeader>
                <ModalBody>
                  <Input
                    label='Mã sinh viên'
                    name='student_code'
                    variant='bordered'
                    defaultValue={student_code}
                  />
                  <Input
                    label='Họ và tên'
                    name='full_name'
                    variant='bordered'
                    defaultValue={full_name}
                  />
                  <Input
                    label='Email'
                    name='email'
                    variant='bordered'
                    defaultValue={email}
                  />
                  <Input
                    label='Mật khẩu'
                    name='password'
                    variant='bordered'
                  />
                  <Input
                    label='Lớp'
                    name='class_name'
                    variant='bordered'
                    defaultValue={class_name}
                  />
                  <Select
                    label='Khoa'
                    name='faculty_id'
                    variant='bordered'
                    defaultSelectedKeys={[faculty_id]}
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
                    defaultSelectedKeys={[course_id]}
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
                    Cập nhật
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

export default UpdateUser;
