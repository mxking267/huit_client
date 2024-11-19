'use client';

import CreateCourse from '@/components/course/create-course';
import CourseTable from '@/components/course/table';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import { title } from '@/components/primitives';
import Search from '@/components/search';
import { Course } from '@/types/course';
import { Page } from '@/types/page';
import { Pagination } from '@nextui-org/pagination';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CoursePage() {
  const [data, setData] = useState<Array<Course>>([]);
  const params = useParams();
  const router = useRouter();

  // Khởi tạo `page` từ URL params, mặc định là 1 nếu không có
  const currentPage = Number(params.page) || 1;
  const [pages, setPages] = useState<Page>({
    currentPage,
    totalPages: 1,
  });

  const fetchData = async (page: number, searchQuery: string = '') => {
    try {
      const data = await fetchWithAuth(
        `course?page=${page}&keyword=${searchQuery}`
      );
      setData(data.data);
      setPages({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    router.push(`/courses?page=${page}`);
    fetchData(page);
  };

  const handleSearch = (query: string) => {
    router.push(`/courses?page=1&search=${query}`); // Điều hướng đến trang 1 với kết quả tìm kiếm
    fetchData(1, query);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className='flex flex-col gap-4 w-full'>
      <h1 className={title()}>Course</h1>
      <div className='flex justify-between gap-4'>
        <Search onSearch={handleSearch} />
        <CreateCourse />
      </div>
      <div>
        <CourseTable data={data} />
      </div>
      <Pagination
        total={pages.totalPages}
        initialPage={1}
        page={pages.currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
}
