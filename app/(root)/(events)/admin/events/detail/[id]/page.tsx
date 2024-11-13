'use client';

import { getAccessToken } from '@/components/utils/getAccessToken';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/image';
import { Event } from '@/types/event';
import { useParams } from 'next/navigation';

export default function EventDetailPage() {
  const [data, setData] = useState<Event | null>(null);
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://eventhuit.io.vn/api/v1/admin/events/detail/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );
      const result = await res.json();
      setData(result);
    };

    if (id) fetchData();
  }, [id]);

  if (!data) return <div>Error</div>;

  return (
    <Card className='py-4 w-full grid grid-cols-2'>
      <CardHeader className='pb-0 pt-2 px-4 flex-col items-start '>
        <h1 className='text-2xl uppercase font-bold'>{data.name}</h1>
        <small className='text-default-500'>
          {new Date(data.date_start).toDateString()} -{' '}
          {new Date(data.date_end).toDateString()}
        </small>
        <p className=''>{data.description}</p>
      </CardHeader>
      <CardBody className='overflow-visible py-2'>
        <Image
          removeWrapper
          alt='Card background'
          className='object-cover rounded-xl w-auto'
          src='https://nextui.org/images/hero-card-complete.jpeg'
          width={270}
        />
      </CardBody>
    </Card>
  );
}
