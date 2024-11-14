'use client';

import { Card, CardFooter, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/image';
import { Event } from '@/types/event';
import { Chip } from '@nextui-org/chip';
import RegisterEvent from '@/components/events/register-event';
import GetQR from '@/components/events/get-qr';
import { format } from 'date-fns';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import { Page } from '@/types/page';
import { Pagination } from '@nextui-org/pagination';
import { useParams, useRouter } from 'next/navigation';
import Search from '@/components/search';

export default function EventPage() {
  const params = useParams();
  const router = useRouter();

  const currentPage = Number(params.page) || 1;
  const [data, setData] = useState<Array<Event & { isRegistered: boolean }>>(
    []
  );
  const [pages, setPages] = useState<Page>({
    currentPage,
    totalPages: 1,
  });

  const fetchData = async (page: number, searchQuery: string = '') => {
    try {
      const res = await fetchWithAuth(
        `event?page=${page}&keyword=${searchQuery}`
      );

      setData(res.data);
      setPages({
        currentPage: res.currentPage,
        totalPages: res.totalPages,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    router.push(`/user/events?page=${page}`);
    fetchData(page);
  };

  const handleSearch = (query: string) => {
    router.push(`/user/events?page=1&search=${query}`); // Điều hướng đến trang 1 với kết quả tìm kiếm
    fetchData(1, query);
  };
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h1 className='text-xl font-bold'>Events</h1>
      </div>

      <div className='flex justify-between gap-4'>
        <Search onSearch={handleSearch} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 w-full'>
        {data.map((event) => (
          <Card
            key={event._id}
            isFooterBlurred
            className='w-full h-[300px]'
          >
            <CardHeader className='absolute z-10 top-1 flex-col items-start text-left backdrop-blur bg-white/10 px-4 rounded-md top-0'>
              <h4 className='text-white/90 font-medium text-xl'>
                {event.name}
              </h4>
            </CardHeader>
            <Image
              removeWrapper
              alt='Relaxing app background'
              className='z-0 w-full h-full object-cover'
              src='https://nextui.org/images/card-example-5.jpeg'
            />

            <CardFooter className='absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100'>
              <div className='flex flex-grow gap-2 items-center'>
                <Chip
                  color='primary'
                  variant='dot'
                  className='text-green-500'
                >
                  {event.status && event.status.toUpperCase()}
                </Chip>
                <div className='flex flex-col'>
                  <p className='text-tiny text-white/60'>{`${format(event.date ? new Date(event.date).toDateString() : new Date(), 'dd/MM/yyyy')}`}</p>
                  <p className='text-tiny text-white/60'>{}</p>
                </div>
              </div>
              {event.isRegistered ? (
                <GetQR eventId={event._id} />
              ) : (
                <RegisterEvent eventId={event._id} />
              )}
            </CardFooter>
          </Card>
        ))}
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
