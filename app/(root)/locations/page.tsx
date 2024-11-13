'use client';

import { getAccessToken } from '@/components/utils/getAccessToken';
import { Location } from '@/types/location';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';
import { Divider } from '@nextui-org/divider';
import { title } from '@/components/primitives';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function App() {
  const [data, setData] = useState<Location[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${apiUrl}/location`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      const result = await res.json();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col w-full gap-4'>
      <h1 className={title()}>Locations</h1>
      {data.map((location) => (
        <Card
          key={location._id}
          className='w-full'
        >
          <CardHeader className='flex gap-3'>
            <p className='text-md'>{location.name}</p>
          </CardHeader>
          <Divider />
          <CardBody className='flex flex-row gap-4 w-full'>
            <small className='text-default-500 item-center'>
              Address:{' '}
              <span className='text-foreground'>{location.address}</span>
              <span className='px-2'>-</span>
              Capacity:{' '}
              <span className='text-foreground'>{location.capacity}</span>
            </small>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
