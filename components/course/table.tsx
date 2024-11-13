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
import UpdateCourse from './update-course';
import DeleteCourse from './delete-course';
import { Course } from '@/types/course';

const columns = [
  {
    key: 'courseId',
    label: 'ID',
  },
  {
    key: 'courseName',
    label: 'NAME',
  },
  {
    key: 'startYear',
    label: 'START YEAR',
  },
  {
    key: 'endYear',
    label: 'END YEAR',
  },
  {
    key: 'actions',
    label: 'ACTION',
  },
];

interface Props {
  data: Course[];
}

export default function CourseTable({ data }: Props) {
  const renderCell = React.useCallback(
    (course: Course, columnKey: React.Key) => {
      const cellValue = course[columnKey as keyof Course];

      switch (columnKey) {
        case 'createdAt':
          return <span>{new Date(cellValue).toLocaleString()}</span>;
        case 'actions':
          return (
            <div className='relative flex items-center gap-2'>
              <Tooltip content='Edit faculty'>
                <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                  <UpdateCourse course={course} />
                </span>
              </Tooltip>
              <Tooltip
                color='danger'
                content='Delete faculty'
              >
                <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                  <DeleteCourse courseId={course._id} />
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
