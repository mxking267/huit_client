'use client';

import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query'; // import useQuery từ react-query
import { title } from '@/components/primitives';
import Search from '@/components/search';
import { Pagination } from '@nextui-org/pagination';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { User } from '@/types/user';
import CreateManager from '@/components/managers/create-manager';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';

const ClientOnlyUserTable = dynamic(() => import('@/components/users/table'), {
  ssr: false,
});

// Hàm lấy dữ liệu người dùng với react-query
const fetchManagers = async (page: number, searchQuery: string = '') => {
  const response = await fetchWithAuth(
    `user/manager?page=${page}&keyword=${searchQuery}`
  );
  return response;
};

export default function ManagerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Khởi tạo `page` từ URL params, mặc định là 1 nếu không có
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';

  const { data, error, isLoading } = useQuery({
    queryKey: ['managers', { currentPage, searchQuery }],
    queryFn: () => fetchManagers(currentPage, searchQuery),
    keepPreviousData: true,
  });

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    router.push(`/managers?page=${page}&search=${searchQuery}`);
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (query: string) => {
    router.push(`/managers?page=1&search=${query}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div className='flex flex-col gap-4'>
      <h1 className={title({ className: 'mb-4' })}>Quản trị viên</h1>
      <div className='flex justify-between gap-4'>
        <Search onSearch={handleSearch} />
        <CreateManager />
      </div>
      <ClientOnlyUserTable users={data.data} />
      <Pagination
        total={data.totalPages}
        initialPage={1}
        page={data.currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
}
