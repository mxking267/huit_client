'use client';

import { title } from '@/components/primitives';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/image';
import { Event, getAttendance, getEventStatusTrans } from '@/types/event';
import { Chip } from '@nextui-org/chip';
import GetQR from '@/components/events/get-qr';
import { format } from 'date-fns';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import { Page } from '@/types/page';
import { Pagination } from '@nextui-org/pagination';
import { useParams, useRouter } from 'next/navigation';
import Search from '@/components/search';
import useGetMe from '@/components/hooks/useGetProfile';

export default function EventRegisteredPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useGetMe();

  const currentPage = Number(params.page) || 1;
  const [data, setData] = useState<
    Array<Event & { isRegistered: boolean; attendanceStatus: string }>
  >([]);
  const [pages, setPages] = useState<Page>({
    currentPage,
    totalPages: 1,
  });

  const fetchData = async (page: number, searchQuery: string = '') => {
    try {
      const res = await fetchWithAuth(
        `user/eventRegistered/${user?._id}?page=${page}&keyword=${searchQuery}`
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
    if (user?._id) {
      fetchData(currentPage);
    }
  }, [currentPage, user]);

  const handlePageChange = (page: number) => {
    router.push(`/events-registered?page=${page}`);
    fetchData(page);
  };

  const handleSearch = (query: string) => {
    router.push(`/events-registered?page=1&search=${query}`);
    fetchData(1, query);
  };

  if (loading) return <div>Loading...</div>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h1 className={title()}>Sự kiện đã đăng ký</h1>
      </div>

      <div className='flex justify-between gap-4'>
        <Search onSearch={handleSearch} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 w-full'>
        {data.map((event) => {
          const canGetQR = new Date(event.date).getTime() >= today.getTime();
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
                  <Chip
                    color={getAttendance(event.attendanceStatus).color}
                    variant='solid'
                  >
                    <span>{getAttendance(event.attendanceStatus).status}</span>
                  </Chip>
                  <div className='flex flex-col'>
                    <p className='text-tiny text-white/60'>{`${format(
                      event.date
                        ? new Date(event.date).toDateString()
                        : new Date(),
                      'dd/MM/yyyy'
                    )}`}</p>
                  </div>
                </div>
                {canGetQR && <GetQR eventId={event._id} />}
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
