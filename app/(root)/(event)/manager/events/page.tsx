'use client';

import { Card, CardFooter, CardHeader } from '@nextui-org/card';
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

type Response = { data: Event[] } & Page;

const fetchEvents = async (page: number) => {
  const response = await fetchWithAuth(`event?page=${page}`);
  return response;
};

const EventPage = () => {
  const params = useParams();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(Number(params.page) || 1); // Initialize with params.page

  const [pages, setPages] = useState<Page>({
    currentPage,
    totalPages: 1,
  });

  const { data, isLoading, isError, refetch } = useQuery<Response>({
    queryKey: ['event-manager', currentPage],
    queryFn: () => fetchEvents(currentPage),
    keepPreviousData: true, // Giữ dữ liệu cũ khi đang fetch
  });

  useEffect(() => {
    if (params.page) {
      const page = Number(params.page);
      setCurrentPage(page); // Update currentPage when params.page changes
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

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h1 className='text-xl font-bold'>Sự kiện</h1>
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
      <div className='grid grid-cols-2 gap-4 p-4 w-full'>
        {data?.data.map((event) => (
          <Card
            key={event._id}
            isFooterBlurred
            className='w-full'
          >
            <CardHeader className='absolute z-10 flex-col items-start text-left backdrop-blur bg-white/10 px-4 rounded-md top-0'>
              <h4 className='text-white/90 font-medium text-xl'>
                {event.name}
              </h4>
            </CardHeader>
            <Image
              removeWrapper
              alt='Relaxing app background'
              className='z-0 w-full rounded-none object-cover h-[300px]'
              fallbackSrc='https://via.placeholder.com/300x200'
              src={
                event.image || 'https://nextui.org/images/card-example-5.jpeg'
              }
            />
            <CardFooter className='absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100'>
              <div className='flex flex-grow gap-2 items-center'>
                <Chip
                  color={getEventStatusTrans(event.status).color}
                  variant='dot'
                  className='text-white'
                >
                  {getEventStatusTrans(event.status).status}
                </Chip>
                <div className='flex flex-col'>
                  <p className='text-tiny text-white'>
                    {format(
                      event.date
                        ? new Date(event.date)
                        : new Date('1970-01-01'),
                      'dd/MM/yyyy'
                    )}
                  </p>
                </div>
              </div>
              <EventManagerAction eventId={event._id} />
            </CardFooter>
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
