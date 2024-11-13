import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table';
import { Pagination } from '@nextui-org/pagination';

import { getAccessToken } from '../utils/getAccessToken';
import { Page } from '@/types/page';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';

import React from 'react';
import { Tooltip } from '@nextui-org/tooltip';
import { EditIcon, EyeIcon, DeleteIcon } from '../icons';

const columns = [
  {
    key: 'full_name',
    label: 'NAME',
  },
  {
    key: 'email',
    label: 'EMAIL',
  },
  {
    key: 'role',
    label: 'ROLE',
  },
  {
    key: 'actions',
    label: 'ACTION',
  },
];

export default function UserTable() {
  const [data, setData] = useState<Array<User>>([]);
  const [pages, setPages] = useState<Page>();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }

        const result = await res.json();
        setData(result.data);
        setPages({
          currentPage: result.currentPage,
          totalPages: result.totalPages,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case 'actions':
        return (
          <div className='relative flex items-center gap-2'>
            <Tooltip content='Details'>
              <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content='Edit user'>
              <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip
              color='danger'
              content='Delete user'
            >
              <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table
      aria-label='Example table with dynamic content'
      bottomContent={
        <div className='flex w-full justify-center'>
          <Pagination
            isCompact
            showControls
            showShadow
            color='secondary'
            page={pages?.currentPage || 0}
            total={pages?.totalPages || 0}
            onChange={(page: number) =>
              setPages({
                totalPages: pages?.totalPages || 0,
                currentPage: page,
              })
            }
          />
        </div>
      }
    >
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
