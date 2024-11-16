'use client';

import { Card, CardFooter, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';
import { Event, getEventStatusTrans } from '@/types/event';
import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import EventManagerAction from '@/components/events/event-manager-action';
import { format } from 'date-fns';
import isAuth from '@/components/hoc/isAuth';
import { ERole } from '@/types/user';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';

const EventPage = () => {
  const [data, setData] = useState<Event[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithAuth(`event`);

        setData(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Xử lý thêm nếu cần, ví dụ: điều hướng đến trang đăng nhập hoặc hiển thị thông báo lỗi
      }
    };

    fetchData();
  }, []);

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
        {data.map((event) => (
          <Card
            key={event._id}
            isFooterBlurred
            className='w-full '
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
                        ? new Date(event.date).toDateString()
                        : new Date(),
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
    </div>
  );
};

export default isAuth(EventPage, [ERole.ADMIN, ERole.MANAGER]);