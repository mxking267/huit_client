'use client';

import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/image';
import { EEventStatus, Event } from '@/types/event';
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
        {data.map((event) => {
          const canGetQR =
            event.status !== EEventStatus.STOPPED && EEventStatus.FINISHED;
          return (
            <Card
              key={event._id}
              isFooterBlurred
              className='w-full'
            >
              <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
                <p className='uppercase font-bold text-left text-md'>
                  {event.name}
                </p>
                <small className='text-default-500'>
                  {format(
                    event.date ? new Date(event.date) : new Date('1970-01-01'),
                    'dd/MM/yyyy'
                  )}
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
