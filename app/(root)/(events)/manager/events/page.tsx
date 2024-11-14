'use client';

import { getAccessToken } from '@/components/utils/getAccessToken';
import { Card, CardFooter, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';
import { Event } from '@/types/event';
import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import EventManagerAction from '@/components/events/event-manager-action';
import { format } from 'date-fns';

export default function EventPage() {
  const [data, setData] = useState<Event[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/event`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });

        const result = await res.json();
        setData(result.data);
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
        <h1 className='text-xl font-bold'>Events</h1>
        <Button
          href={`/admin/events/create`}
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
            <CardHeader className=' z-10 top-1 flex-col items-start h-[80px]'>
              <h4 className='text-foreground font-medium text-xl text-left line-clamp-2'>
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
            <CardFooter className=' bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100'>
              <div className='flex flex-grow gap-2 items-center'>
                <Chip
                  color='primary'
                  variant='dot'
                  className='text-green-500'
                >
                  {event.status && event.status.toUpperCase()}
                </Chip>
                <div className='flex flex-col'>
                  <p className='text-tiny text-foreground'>
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
}
