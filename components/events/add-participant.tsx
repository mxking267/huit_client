'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from '@nextui-org/modal';
import Search from '@/components/search';
import StudentTable from '@/components/events/student-table'; // Bảng hiển thị danh sách sinh viên
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import { Pagination } from '@nextui-org/pagination';
import { User } from '@/types/user';
import { Select, SelectItem } from '@nextui-org/select';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToList: (user: User) => void;
}

const fetchStudents = async (
  course_id: string,
  faculty_id: string,
  page: number,
  search: string
) => {
  const response = await fetchWithAuth(
    `/students?course_id=${course_id}&faculty_id=${faculty_id}&page=${page}&keyword=${search}`
  );
  return response;
};

const fetchCourses = async () => {
  const response = await fetchWithAuth(`/course/all`);
  return response;
};

const fetchFaculties = async () => {
  const response = await fetchWithAuth(`/faculty/all`);
  return response;
};

export default function AddStudentModal({
  isOpen,
  onClose,
  onAddToList,
}: AddStudentModalProps) {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [facultyId, setFacultyId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: courses, isLoading: isLoadingCourses } = useQuery(
    ['courses'],
    fetchCourses,
    { enabled: isOpen }
  );

  const { data: faculties, isLoading: isLoadingFaculties } = useQuery(
    ['faculties'],
    fetchFaculties,
    { enabled: isOpen }
  );

  // Fetch students based on selected course, faculty, page, and search query
  const {
    data,
    isLoading: isLoadingStudents,
    error,
  } = useQuery(
    ['students', courseId, facultyId, page, searchQuery],
    () =>
      courseId && facultyId
        ? fetchStudents(courseId, facultyId, page, searchQuery)
        : Promise.resolve({ data: [], totalPages: 1 }),
    {
      enabled: isOpen && !!courseId && !!facultyId,
    }
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset về trang đầu tiên
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='xl'
    >
      <ModalHeader>
        <h1 className='text-xl font-bold'>Thêm sinh viên vào danh sách</h1>
      </ModalHeader>
      <ModalBody>
        <div className='flex flex-col gap-4'>
          <Select
            label='Chọn khóa học'
            isLoading={isLoadingCourses}
            onSelectionChange={(value) => setCourseId(value as string)}
          >
            {courses?.map((course: { id: string; name: string }) => (
              <SelectItem
                key={course.id}
                value={course.id}
              >
                {course.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            label='Chọn khoa'
            isLoading={isLoadingFaculties}
            onSelectionChange={(value) => setFacultyId(value as string)}
          >
            {faculties?.map((faculty: { id: string; name: string }) => (
              <SelectItem
                key={faculty.id}
                value={faculty.id}
              >
                {faculty.name}
              </SelectItem>
            ))}
          </Select>

          <Search onSearch={handleSearch} />

          {isLoadingStudents ? (
            <p>Đang tải danh sách sinh viên...</p>
          ) : error ? (
            <p>Lỗi: {(error as Error).message}</p>
          ) : (
            <StudentTable
              users={(data?.data as User[]) || []}
              onAddToList={onAddToList}
            />
          )}

          <Pagination
            total={data?.totalPages || 1}
            initialPage={1}
            page={page}
            onChange={handlePageChange}
          />
        </div>
      </ModalBody>
    </Modal>
  );
}
