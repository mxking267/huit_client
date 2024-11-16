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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${apiUrl}/event/detail/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      const result = await res.json();
      setData(result);
    };

    if (id) fetchData();
  }, [id]);

  if (!data) return <div>Error</div>;

  const formattedContent = data.description.replace(/\n/g, '<br />');

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex justify-between'>
        <h1 className='text-xl font-bold'>Chi tiết sự kiện</h1>
      </div>
      <Card className='py-4 w-full grid grid-cols-2'>
        <CardHeader className='pb-0 pt-2 px-4 flex-col items-start text-left gap-2'>
          <h1 className='text-2xl uppercase font-bold'>{data.name}</h1>
          <small className='text-default-500'>
            {new Date(data.date).toDateString()}
          </small>
          <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
          <span className='text-default-500'>
            Bonus point:{' '}
            <span className='text-foreground'>{data.bonus_points}</span>
          </span>
        </CardHeader>
        <CardBody className='overflow-visible py-2'>
          <Image
            removeWrapper
            alt='Card background'
            className='object-cover rounded-xl w-auto'
            src={
              data.image || 'https://nextui.org/images/hero-card-complete.jpeg'
            }
            width={270}
          />
        </CardBody>
      </Card>
    </div>
  );
}
