'use client';

import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';
import { Event, getEventStatusTrans } from '@/types/event';
import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import EventManagerAction from '@/components/events/event-manager-action';
import { format } from 'date-fns';
import isAuth from '@/components/hoc/isAuth';
import { ERole } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import { useEffect, useState } from 'react';
import { Page } from '@/types/page';
import { useParams, useRouter } from 'next/navigation';
import { Pagination } from '@nextui-org/pagination';
import ChangeStatusEvent from '@/components/events/change-status';
import Search from '@/components/search';

type Response = { data: Event[] } & Page;

const fetchEvents = async (page: number, searchQuery: string = '') => {
  const response = await fetchWithAuth(
    `event?page=${page}&keyword=${searchQuery}`
  );
  return response;
};

const EventPage = () => {
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(Number(params.page) || 1); // Initialize with params.page

  const [pages, setPages] = useState<Page>({
    currentPage,
    totalPages: 1,
  });

  const { data, isLoading, isError, refetch } = useQuery<Response>({
    queryKey: ['event-manager', currentPage, searchQuery],
    queryFn: () => fetchEvents(currentPage, searchQuery),
    keepPreviousData: true, // Giữ dữ liệu cũ khi đang fetch
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

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h1 className='text-xl font-bold'>Sự kiện</h1>
        <div className='flex justify-between gap-4'>
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
              <p className='uppercase font-bold text-left text-md'>
                {event.name}
              </p>
              <small className='text-default-500'>
                {format(
                  event.date ? new Date(event.date) : new Date('1970-01-01'),
                  'dd/MM/yyyy'
                )}
              </small>
              <ChangeStatusEvent event={event} />
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
