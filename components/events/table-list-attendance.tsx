import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table';

import React from 'react';
import { EEventStatus, EventParticipant, getAttendance } from '@/types/event';
import { Button } from '@nextui-org/button';

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
  {
    key: 'actions',
    label: 'Hành động',
  },
];

interface Props {
  data: EventParticipant[];
}

export default function ParticipantTable({ data }: Props) {
  const renderCell = React.useCallback(
    (eventParticipant: EventParticipant, columnKey: React.Key) => {
      const cellValue = eventParticipant[columnKey as keyof EventParticipant];

      switch (columnKey) {
        case 'actions':
          return (
            <div className='flex gap-2'>
              <Button color='primary'>Check-in</Button>
              <Button color='primary'>Check-out</Button>
            </div>
          );
        case 'status':
          return getAttendance(cellValue as EEventStatus).status
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <Table aria-label='Example table with dynamic content'>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
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
  );
}
