'use client';

import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';
import { EEventType, Event, getEventStatusTrans } from '@/types/event';
import { Link } from '@nextui-org/link';
import EventManagerAction from '@/components/events/event-manager-action';
import { format } from 'date-fns';
import isAuth from '@/components/hoc/isAuth';
import { ERole } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import React, { useEffect, useState } from 'react';
import { Page } from '@/types/page';
import { useParams, useRouter } from 'next/navigation';
import { Pagination } from '@nextui-org/pagination';
import Search from '@/components/search';
import { Select, SelectItem } from '@nextui-org/select';
import { Selection } from '@nextui-org/table';
import { Faculty } from '@/types/faculty';
import { getAccessToken } from '@/components/utils/getAccessToken';

type Response = { data: Event[] } & Page;

const fetchFaculties = async (): Promise<Faculty[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [faculties] = await Promise.all([
    fetch(`${apiUrl}/faculty/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }).then((res) => res.json()),
  ]);

  return faculties;
};

const fetchEvents = async (
  page: number,
  searchQuery: string = '',
  type: string | null,
  status: string,
  faculty: string | null
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    keyword: searchQuery,
    status,
    ...(type && type !== 'Tất cả' ? { type } : {}),
    ...(faculty ? { faculty_id: faculty } : {}),
  });

  const response = await fetchWithAuth(`event?${params.toString()}`);
  return response;
};

const EventPage = () => {
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(Number(params.page) || 1); // Initialize with params.page
  const [typeFilter, setTypeFilter] = React.useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = React.useState<Selection>(
    new Set([])
  );
  const [facultyFilter, setFacultyFilter] = React.useState<Selection>(
    new Set([])
  );

  const [pages, setPages] = useState<Page>({
    currentPage,
    totalPages: 1,
  });

  const { data: facultyData, isLoading: isFetching } = useQuery<Faculty[]>(
    ['faculties-events'],
    () => fetchFaculties()
  );

  const { data, refetch } = useQuery<Response>({
    queryKey: [
      'event-manager',
      currentPage,
      searchQuery,
      typeFilter,
      statusFilter,
      facultyFilter,
    ],
    queryFn: () =>
      fetchEvents(
        currentPage,
        searchQuery,
        Array.from(typeFilter).join(','),
        Array.from(statusFilter).join(','),
        Array.from(facultyFilter).join(',')
      ),
    keepPreviousData: true,
  });
  useEffect(() => {
    if (params.page) {
      const page = Number(params.page);
      setCurrentPage(page); // Update currentPage when params.page changes
      refetch();
    }
  }, [params.page]);

  useEffect(() => {
    if (data) {
      setPages({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
    }
  }, [data]);

  // Hàm thay đổi trang và gọi lại API
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Cập nhật currentPage
    router.push(`/manager/events?page=${page}`); // Điều hướng đến trang mới
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/manager/events?page=1&search=${query}`); // Điều hướng đến trang 1 với kết quả tìm kiếm
  };

  const faculties = facultyData || [];

  console.log(faculties);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between gap-4'>
        <h1 className='text-xl font-bold min-w-max'>Sự kiện</h1>
        <div className='flex justify-between gap-4 w-full'>
          <Select
            label='Loại sự kiện'
            selectedKeys={typeFilter}
            onSelectionChange={setTypeFilter}
            className={'w-full max-w-none'}
          >
            {['Tất cả', ...Object.values(EEventType).map((type) => type)].map(
              (type) => (
                <SelectItem
                  key={type}
                  value={type}
                >
                  {getEventStatusTrans(type as EEventType)}
                </SelectItem>
              )
            )}
          </Select>

          <Select
            label='Trạng thái'
            selectedKeys={statusFilter}
            onSelectionChange={setStatusFilter}
          >
            <SelectItem
              key='all'
              value='all'
            >
              Tất cả
            </SelectItem>
            <SelectItem
              key='upcoming'
              value='upcoming'
            >
              Sắp diễn ra
            </SelectItem>
            <SelectItem
              key='past'
              value='past'
            >
              Đã diễn ra
            </SelectItem>
          </Select>

          <Select
            label='Khoa'
            name='faculty_id'
            defaultSelectedKeys={facultyFilter}
            onSelectionChange={setFacultyFilter}
            isLoading={isFetching}
          >
            {[{ _id: 'all', name: 'Tất cả' }, ...faculties].map((item) => (
              <SelectItem
                value={item._id}
                key={item._id}
              >
                {item.name}
              </SelectItem>
            ))}
          </Select>
          <Search onSearch={handleSearch} />
          <Button
            href={`/manager/events/create`}
            as={Link}
            color='primary'
            variant='solid'
            radius='full'
            size='md'
          >
            Tạo mới
          </Button>
        </div>
      </div>
      <div className='grid grid-cols-4 gap-4 p-4 w-full'>
        {data?.data.map((event) => (
          <Card
            key={event._id}
            className=''
          >
            <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
              <div className='self-end'>
                <EventManagerAction eventId={event._id} />
              </div>
              <p className='uppercase font-bold text-left text-md line-clamp-2'>
                {event.name}
              </p>
              <small className='text-default-500'>
                {format(
                  event.date ? new Date(event.date) : new Date('1970-01-01'),
                  'dd/MM/yyyy'
                )}
                {' - '}
                {getEventStatusTrans(event.type)}
              </small>

              {event.faculty_id ? (
                <small className='text-default-500'>
                  {event.faculty_id.name}
                </small>
              ) : (
                <small className='text-default-500'>Toàn trường</small>
              )}
            </CardHeader>
            <CardBody className='overflow-visible py-2 items-end justify-end'>
              <Image
                removeWrapper
                alt='Card background'
                className='object-cover rounded-xl max-w-none w-full self-end'
                src={
                  event.image || 'https://nextui.org/images/card-example-5.jpeg'
                }
              />
            </CardBody>
          </Card>
        ))}
      </div>

      <Pagination
        initialPage={currentPage}
        page={pages.currentPage}
        total={pages.totalPages}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default isAuth(EventPage, [ERole.ADMIN, ERole.MANAGER]);
