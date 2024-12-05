'use client';

import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/image';
import { EEventType, Event, getEventStatusTrans } from '@/types/event';
import { Chip } from '@nextui-org/chip';
import RegisterEvent from '@/components/events/register-event';
import { format } from 'date-fns';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import { Page } from '@/types/page';
import { Pagination } from '@nextui-org/pagination';
import { useParams, useRouter } from 'next/navigation';
import Search from '@/components/search';
import { Link } from '@nextui-org/link';
import { Button } from '@nextui-org/button';
import { Select, SelectItem } from '@nextui-org/select';
import React from 'react';
import { Selection } from '@nextui-org/table';
import { useQuery } from '@tanstack/react-query';

type Response = { data: Array<Event & { isRegistered: boolean }> } & Page;

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

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(Number(params.page) || 1);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Cập nhật currentPage
    router.push(`/user/events?page=${page}`); // Điều hướng đến trang mới
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/user/events?page=1&search=${query}`); // Điều hướng đến trang 1 với kết quả tìm kiếm
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!data) return <div>Bạn đã vượt thời gian học tại trường</div>;
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h1 className='text-xl font-bold'>Events</h1>
      </div>

      <div className='flex justify-between gap-4'>
        <Search onSearch={handleSearch} />
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
        >
          {[
            { _id: '', name: 'Tất cả' },
            { _id: 'all', name: 'Toàn trường' },
            { _id: 'faculty', name: 'Sự kiện của khoa' },
          ].map((item) => (
            <SelectItem
              value={item._id}
              key={item._id}
            >
              {item.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 w-full'>
        {data?.data.map((event) => {
          const canGetQR = new Date(event.date).getTime() <= today.getTime();
          return (
            <Card
              key={event._id}
              isFooterBlurred
              className='w-full'
            >
              <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
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
                <small className='text-default-500'>
                  {event.faculty_id ? null : 'Toàn trường'}
                </small>
              </CardHeader>
              <CardBody className='overflow-visible py-2 items-end justify-end'>
                <Image
                  removeWrapper
                  alt='Relaxing app background'
                  className='object-cover rounded-xl max-w-none w-full self-end'
                  src={
                    event.image ||
                    'https://nextui.org/images/card-example-5.jpeg'
                  }
                />
              </CardBody>

              <CardFooter className='bottom-0 z-10'>
                <div className='flex flex-grow gap-2 items-center'>
                  <Button
                    href={`/user/events/detail/${event._id}`}
                    as={Link}
                    color='primary'
                    showAnchorIcon
                    variant='solid'
                  >
                    Xem chi tiết
                  </Button>
                  <div className='flex flex-col'>
                    <span className='text-tiny text-white/60'>{`${format(
                      event.date
                        ? new Date(event.date).toDateString()
                        : new Date(),
                      'dd/MM/yyyy'
                    )}`}</span>
                  </div>
                </div>
                {canGetQR ? (
                  event.isRegistered ? (
                    <Chip
                      color={'success'}
                      variant='bordered'
                      className='text-green-500'
                    >
                      Đã đăng ký
                    </Chip>
                  ) : (
                    <RegisterEvent eventId={event._id} />
                  )
                ) : null}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Pagination
        initialPage={1}
        page={pages.currentPage}
        total={pages.totalPages}
        onChange={handlePageChange}
      />
    </div>
  );
}
