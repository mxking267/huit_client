'use client';

import { getAccessToken } from '@/components/utils/getAccessToken';
import { Card, CardFooter, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/image';
import { Event } from '@/types/event';
import { Chip } from '@nextui-org/chip';
import RegisterEvent from '@/components/events/register-event';
import GetQR from '@/components/events/get-qr';
import { format } from 'date-fns';

export default function EventPage() {
  const [data, setData] = useState<Array<Event & { isRegistered: boolean }>>(
    []
  );
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h1 className='text-xl font-bold'>Events</h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 w-full'>
        {data.map((event) => (
          <Card
            key={event._id}
            isFooterBlurred
            className='w-full h-[300px]'
          >
            <CardHeader className='absolute z-10 top-1 flex-col items-start'>
              <h4 className='text-white/90 font-medium text-xl'>
                {event.name}
              </h4>
              <p className='text-tiny text-white/60 uppercase font-bold'>
                {event.description}
              </p>
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
                  <p className='text-tiny text-white/60'>{`${format(new Date(event.date_start).toDateString(), 'dd/MM/yyyy')} - ${format(new Date(event.date_end).toDateString(), 'dd/MM/yyyy')}`}</p>
                  <p className='text-tiny text-white/60'>{}</p>
                </div>
              </div>
              {event.isRegistered ? (
                <RegisterEvent eventId={event._id} />
              ) : (
                <GetQR eventId={event._id} />
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
