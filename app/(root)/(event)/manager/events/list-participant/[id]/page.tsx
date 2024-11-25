'use client';

import { useState } from 'react';
import { EventParticipant } from '@/types/event';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import { title } from '@/components/primitives';
import ParticipantTable from '@/components/events/table-list-attendance';
import Search from '@/components/search';
import { Button } from '@nextui-org/button';
import { exportToExcel } from '@/components/utils/export-excel';
import { User } from '@/types/user';

const fetchParticipants = async (id: string, searchQuery: string = '') => {
  const res = await fetchWithAuth(
    `/event/listParticipant/${id}?keyword=${searchQuery}`
  );
  return res;
};

const addParticipant = async (
  id: string,
  participant: Partial<EventParticipant>
) => {
  const res = await fetchWithAuth(`/event/addParticipant/${id}`, {
    method: 'POST',
    body: JSON.stringify(participant),
  });
  if (!res.ok) throw new Error('Failed to add participant');
  return res.json();
};

export default function ListParticipantPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');

  // Fetch participants
  const { data, isLoading, isError, refetch } = useQuery<EventParticipant[]>(
    ['participants', id, searchQuery],
    () => fetchParticipants(id, searchQuery),
    {
      enabled: !!id, // Chỉ fetch nếu có id
    }
  );

  // Add participant mutation
  const { mutate: addNewParticipant } = useMutation(
    (participant: Partial<EventParticipant>) => addParticipant(id, participant),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['participants', id]); // Refetch danh sách
      },
    }
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/manager/events/list-participant/${id}?search=${query}`);
    refetch(); // Gọi lại query khi thay đổi
  };

  const handleExport = () => {
    if (data) exportToExcel(data);
  };

  const handleAddParticipant = (select: User) => {
    addNewParticipant(select);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div className='flex flex-col gap-4 w-full'>
      <h1 className={title()}>Danh sách người tham gia</h1>
      <div className='flex justify-between gap-4'>
        <Search onSearch={handleSearch} />
        <div className='flex gap-2'>
          <Button
            color='primary'
            onClick={handleExport}
          >
            Xuất danh sách
          </Button>
        </div>
      </div>
      <div>
        <ParticipantTable data={data || []} />
      </div>
    </div>
  );
}
