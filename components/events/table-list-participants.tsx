import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table';

import React, { useEffect, useState } from 'react';
import { EventParticipant } from '@/types/event';
import fetchWithAuth from '../hooks/fetchWithAuth';
import Search from '../search';

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

export default function ParticipantTable({ eventId }: Props) {
  const [data, setData] = useState<EventParticipant[]>([]);

  const fetchData = async (searchQuery: string = '') => {
    const res = await fetchWithAuth(
      `/event/listParticipant/${eventId}?keyword=${searchQuery}`
    );
    setData(res);
  };

  useEffect(() => {
    fetchData('');
  }, []);

  const handleSearch = (query: string) => {
    fetchData(query);
  };

  const renderCell = React.useCallback(
    (eventParticipant: EventParticipant, columnKey: React.Key) => {
      const cellValue = eventParticipant[columnKey as keyof EventParticipant];

      switch (columnKey) {
        case 'actions':
          return <span>Check in/ check out</span>;
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
        <TableBody items={data}>
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
