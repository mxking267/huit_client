'use client';

import { title } from '@/components/primitives';
import { Card, CardFooter, CardHeader } from '@nextui-org/card';
import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/image';
import {
  EAttendanceStatus,
  EEventStatus,
  Event,
  getAttendance,
} from '@/types/event';
import { Chip } from '@nextui-org/chip';
import GetQR from '@/components/events/get-qr';
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
        <h1 className={title()}>Lịch sử tham gia</h1>
      </div>

      <div className='flex flex-col justify-start'>
        {data.map((semesterItem) => {
          const events = semesterItem.events;

          if (events.length === 0) return null;
          return (
            <div key={semesterItem.semester}>
              <h4 className='w-max'>Kì: {semesterItem.semester}</h4>
              <h6 className='w-max'>
                Tổng điểm cộng: {semesterItem.totalPoints}
              </h6>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 w-full'>
                {events.map((event) => {
                  return (
                    <Card
                      key={event._id}
                      isFooterBlurred
                      className='w-full h-[300px]'
                    >
                      <CardHeader className='absolute z-10 flex-col items-start text-left backdrop-blur bg-white/10 px-4 rounded-md top-0'>
                        <h4 className='text-white/90 font-medium text-xl'>
                          {event.name}
                        </h4>
                      </CardHeader>
                      <Image
                        removeWrapper
                        alt='Relaxing app background'
                        className='z-0 w-full h-full object-cover'
                        src='https://nextui.org/images/card-example-5.jpeg'
                      />

                      <CardFooter className='absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100'>
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
