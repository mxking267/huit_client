'use client';

import { getAccessToken } from '@/components/utils/getAccessToken';
import { Location } from '@/types/location';
import { Card, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function App() {
  const [data, setData] = useState<Location[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${apiUrl}/admin/locations`, {
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
    <div className='flex flex-col w-full'>
      {data.map((location) => (
        <Card
          key={location._id}
          className='w-full'
        >
          <CardHeader className='flex gap-3'>
            <div className='flex flex-col'>
              <p className='text-md'>{location.name}</p>
              <p>{location.address}</p>
              <small className='text-default-500'>
                Capacity: {location.capacity}
              </small>{' '}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
