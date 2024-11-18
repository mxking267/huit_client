'use client';

import dynamic from 'next/dynamic';

const ClientOnlyUserTable = dynamic(() => import('@/components/users/table'), {
  ssr: false,
});

import { title } from '@/components/primitives';
import Search from '@/components/search';
import { Pagination } from '@nextui-org/pagination';
import { useEffect, useState } from 'react';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import { Page } from '@/types/page';
import { useParams, useRouter } from 'next/navigation';
import { User } from '@/types/user';

export default function UserPage() {
  const [data, setData] = useState<Array<User>>([]);
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
        `user/manager/?page=${page}&keyword=${searchQuery}`
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
    router.push(`/users?page=${page}`);
    fetchData(page);
  };

  const handleSearch = (query: string) => {
    router.push(`/managers?page=1&search=${query}`); // Điều hướng đến trang 1 với kết quả tìm kiếm
    fetchData(1, query);
  };
  return (
    <div className='flex flex-col gap-4'>
      <h1 className={title({ className: 'mb-4' })}>Quản trị viên</h1>
      <div className='flex justify-between gap-4'>
        <Search onSearch={handleSearch} />
        {/* <CreateLocation /> */}
      </div>
      <ClientOnlyUserTable users={data} />
      <Pagination
        total={pages.totalPages}
        initialPage={1}
        page={pages.currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
}
