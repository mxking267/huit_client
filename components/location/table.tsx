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
import UpdateLocation from './update-location';
import DeleteLocation from './delete-location';
import { Location } from '@/types/location';

const columns = [
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'address',
    label: 'ADDRESS',
  },
  {
    key: 'capacity',
    label: 'CAPACITY',
  },
  {
    key: 'actions',
    label: 'ACTION',
  },
];

interface Props {
  data: Location[];
}

export default function LocationTable({ data }: Props) {
  const renderCell = React.useCallback(
    (location: Location, columnKey: React.Key) => {
      const cellValue = location[columnKey as keyof Location];

      switch (columnKey) {
        case 'createdAt':
          return <span>{new Date(cellValue).toLocaleString()}</span>;
        case 'actions':
          return (
            <div className='relative flex items-center gap-2'>
              <Tooltip content='Edit location'>
                <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                  <UpdateLocation location={location} />
                </span>
              </Tooltip>
              <Tooltip
                color='danger'
                content='Delete location'
              >
                <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                  <DeleteLocation locationId={location._id} />
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
