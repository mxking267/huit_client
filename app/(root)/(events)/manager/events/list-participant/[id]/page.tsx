'use client';

import { useEffect, useState } from 'react';
import { EventParticipant } from '@/types/event';
import { useParams, useRouter } from 'next/navigation';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import { title } from '@/components/primitives';
import ParticipantTable from '@/components/events/table-list-attendance';
import Search from '@/components/search';

export default function ListParticipantPage() {
  const [data, setData] = useState<EventParticipant[]>([]);
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const fetchData = async (searchQuery: string = '') => {
    const res = await fetchWithAuth(
      `/event/listParticipant/${id}?keyword=${searchQuery}`
    );
    setData(res);
  };

  useEffect(() => {
    if (id) fetchData('');
  }, [id]);

  const handleSearch = (query: string) => {
    router.push(`/manager/events/list-participant/${id}?search=${query}`);
    fetchData(query);
  };

  if (!data) return <div>Error</div>;

  return (
    <div className='flex flex-col gap-4 w-full'>
      <h1 className={title()}>Danh sách người tham gia</h1>
      <div className='flex justify-between gap-4'>
        <Search onSearch={handleSearch} />
      </div>
      <div>
        <ParticipantTable data={data} />
      </div>
    </div>
  );
}
