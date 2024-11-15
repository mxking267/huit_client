'use client';

import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/image';
import { Event } from '@/types/event';
import { useParams } from 'next/navigation';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';

export default function EventDetailPage() {
  const [data, setData] = useState<Event | null>(null);
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchWithAuth(`events/detail/${id}`);
      setData(res);
    };

    if (id) fetchData();
  }, [id]);

  if (!data) return <div>Error</div>;

  return (
    <div className=''>
      <Card className='py-4 w-full'>
        <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
          <p className='text-tiny uppercase font-bold'>{data.name}</p>
          <small className='text-default-500'>
            {new Date(data.date).toDateString()}
          </small>
          <h6 className='font-bold text-large'>{data.description}</h6>
        </CardHeader>
        <CardBody className='overflow-visible py-2'>
          <Image
            alt='Card background'
            className='object-cover rounded-xl'
            src='https://nextui.org/images/hero-card-complete.jpeg'
            width={270}
          />
        </CardBody>
      </Card>
    </div>
  );
}
