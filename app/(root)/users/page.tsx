'use client';

import dynamic from 'next/dynamic';
import { title } from '@/components/primitives';
import Search from '@/components/search';
import { Pagination } from '@nextui-org/pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import CreateUser from '@/components/users/create-user';
import { Suspense } from 'react';

// Dynamic import cho bảng người dùng, chỉ chạy ở client
const ClientOnlyUserTable = dynamic(() => import('@/components/users/table'), {
  ssr: false,
});

// Fetch function sử dụng react-query
const fetchUsers = async (page: number, keyword: string = '') => {
  const response = await fetchWithAuth(`user?page=${page}&keyword=${keyword}`);
  return response;
};

export default function UserPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UserPageContent />
    </Suspense>
  );
}

// Component chính bên trong Suspense
function UserPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', { currentPage, searchQuery }],
    queryFn: () => fetchUsers(currentPage, searchQuery),
    keepPreviousData: true,
  });

  const handlePageChange = (page: number) => {
    router.push(`/users?page=${page}&search=${searchQuery}`);
  };

  const handleSearch = (query: string) => {
    router.push(`/users?page=1&search=${query}`);
  };

  return (
    <div className='flex flex-col gap-4'>
      <h1 className={title({ className: 'mb-4' })}>Người dùng</h1>
      <div className='flex justify-between gap-4'>
        <Search onSearch={handleSearch} />
        <CreateUser />
      </div>
      {isLoading && <p>Đang tải...</p>}
      {isError && <p>Có lỗi xảy ra khi tải dữ liệu.</p>}
      {!isLoading && !isError && (
        <>
          <ClientOnlyUserTable
            users={data?.data || []}
            type='USER'
          />
          <Pagination
            total={data?.totalPages || 1}
            initialPage={1}
            page={currentPage}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
