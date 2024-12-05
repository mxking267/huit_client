import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table';

import React, { useEffect, useState } from 'react';
import {
  EAttendanceStatus,
  EventParticipant,
  getAttendance,
} from '@/types/event';
import fetchWithAuth from '../hooks/fetchWithAuth';
import Search from '../search';
import { Button } from '@nextui-org/button';
import { useQuery } from '@tanstack/react-query';

const columns = [
  {
    key: 'student_code',
    label: 'MSSV',
  },
  {
    key: 'full_name',
    label: 'Họ tên',
  },
  {
    key: 'class_name',
    label: 'Lớp',
  },
  {
    key: 'status',
    label: 'Trạng thái',
  },
];

interface Props {
  eventId: string;
}

// Fetch function to get participant data with search query
const fetchData = async (searchQuery: string = '', eventId: string) => {
  const res = await fetchWithAuth(
    `/event/listParticipant/${eventId}?keyword=${searchQuery}`
  );
  return res;
};

export default function ParticipantTable({ eventId }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data } = useQuery<EventParticipant[]>({
    queryKey: ['attendance', eventId, searchQuery],
    queryFn: () => fetchData(searchQuery, eventId),
    keepPreviousData: true,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderCell = React.useCallback(
    (eventParticipant: EventParticipant, columnKey: React.Key) => {
      const cellValue = eventParticipant[columnKey as keyof EventParticipant];

      switch (columnKey) {
        case 'status':
          return getAttendance(cellValue as EAttendanceStatus).status;
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <div className='flex flex-col gap-4'>
      <Search onSearch={handleSearch} />
      <Table aria-label='Example table with dynamic content'>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={data || []}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
