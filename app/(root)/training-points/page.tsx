'use client';

import { title } from '@/components/primitives';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/image';
import {
  EAttendanceStatus,
  Event,
  getAttendance,
  getEventStatusTrans,
} from '@/types/event';
import { Chip } from '@nextui-org/chip';
import { format } from 'date-fns';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import useGetMe from '@/components/hooks/useGetProfile';

type TrainingPointsResponse = {
  semester: number;
  totalPoints: number;
  events: Array<Event & { attendanceStatus: string }>;
};

export default function EventRegisteredPage() {
  const { user, loading } = useGetMe();

  const [data, setData] = useState<TrainingPointsResponse[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetchWithAuth(
        `user/trainingPointOnSemester/${user?._id}`
      );

      setData(res.semesters);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h1 className={title()}>Lịch sử cộng điểm rèn luyện</h1>
      </div>

      <div className='flex flex-col justify-start'>
        {data.map((semesterItem) => {
          const events = semesterItem.events;

          if (events.length === 0) return null;
          return (
            <div key={semesterItem.semester}>
              <h4 className='w-max'>Kì: {semesterItem.semester}</h4>
              <h6 className='w-max'>
                Tổng điểm rèn luyện được cộng: {semesterItem.totalPoints}
              </h6>
              <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 w-full'>
                {events.map((event) => {
                  return (
                    <Card
                      key={event._id}
                      isFooterBlurred
                      className='w-full'
                    >
                      <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
                        <p className='uppercase font-bold text-left text-md line-clamp-2'>
                          {event.name}
                        </p>
                        <small className='text-default-500'>
                          {format(
                            event.date
                              ? new Date(event.date)
                              : new Date('1970-01-01'),
                            'dd/MM/yyyy'
                          )}
                          {' - '}
                          {getEventStatusTrans(event.type)}
                        </small>
                        <small className='text-default-500'>
                          {event.faculty_id ? null : 'Toàn trường'}
                        </small>
                      </CardHeader>
                      <CardBody className='overflow-visible py-2 items-end justify-end'>
                        <Image
                          removeWrapper
                          alt='Relaxing app background'
                          className='object-cover rounded-xl max-w-none w-full self-end'
                          src={
                            event.image ||
                            'https://nextui.org/images/card-example-5.jpeg'
                          }
                        />
                      </CardBody>

                      <CardFooter className='bottom-0 z-10'>
                        <div className='flex flex-grow gap-2 items-center'>
                          <Chip
                            color={getAttendance(event.attendanceStatus).color}
                            variant='solid'
                          >
                            <span>
                              {getAttendance(event.attendanceStatus).status}
                            </span>
                          </Chip>
                          <div className='flex flex-col'>
                            <p className='text-tiny text-white/60'>{`${format(event.date ? new Date(event.date).toDateString() : new Date(), 'dd/MM/yyyy')}`}</p>
                          </div>
                        </div>
                        <Chip
                          color={'success'}
                          variant='bordered'
                        >
                          <span>
                            +
                            {event.attendanceStatus ===
                            EAttendanceStatus.CHECKED_OUT
                              ? event.bonus_points
                              : 0}
                          </span>
                        </Chip>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
