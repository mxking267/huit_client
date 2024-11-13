import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table';

import React from 'react';
import { Tooltip } from '@nextui-org/tooltip';
import { DeleteIcon } from '../icons';
import UpdateFaculty from './update-faculty';
import { Faculty } from '@/types/faculty';
import DeleteFaculty from './delete-faculty';

const columns = [
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'createdAt',
    label: 'CREATE AT',
  },
  {
    key: 'actions',
    label: 'ACTION',
  },
];

interface Props {
  data: Faculty[];
}

export default function FacultyTable({ data }: Props) {
  const renderCell = React.useCallback(
    (faculty: Faculty, columnKey: React.Key) => {
      const cellValue = faculty[columnKey as keyof Faculty];

      switch (columnKey) {
        case 'createdAt':
          return <span>{new Date(cellValue).toLocaleString()}</span>;
        case 'actions':
          return (
            <div className='relative flex items-center gap-2'>
              <Tooltip content='Edit faculty'>
                <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                  <UpdateFaculty faculty={faculty} />
                </span>
              </Tooltip>
              <Tooltip
                color='danger'
                content='Delete faculty'
              >
                <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                  <DeleteFaculty facultyId={faculty._id} />
                </span>
              </Tooltip>
            </div>
          );
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
