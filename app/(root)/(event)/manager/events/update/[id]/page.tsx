'use client';

import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Image } from '@nextui-org/image';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { DatePicker } from '@nextui-org/date-picker';
import {
  now,
  getLocalTimeZone,
  DateValue,
  parseAbsoluteToLocal,
} from '@internationalized/date';
import { Select, SelectItem } from '@nextui-org/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccessToken } from '@/components/utils/getAccessToken';
import { Location } from '@/types/location';
import { Faculty } from '@/types/faculty';
import { Event } from '@/types/event';
import { ZonedDateTime } from '@internationalized/date';

type FetchData = {
  events: Event;
  locations: Location[];
  faculties: Faculty[];
};

// Fetch helper function
const fetchLocationsAndFaculties = async (
  eventId: string
): Promise<FetchData> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [events, locations, faculties] = await Promise.all([
    fetch(`${apiUrl}/event/detail/${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }).then((res) => res.json()),

    fetch(`${apiUrl}/location/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }).then((res) => res.json()),

    fetch(`${apiUrl}/faculty/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }).then((res) => res.json()),
  ]);

  return { events, locations, faculties };
};

// Mutation helper function
const updateEvent = async (params: {
  formData: FormData;
  id: string;
}): Promise<Event> => {
  const { formData, id } = params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/event/edit/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update event');
  }

  return response.json();
};

export default function UpdateEventPage() {
  const params = useParams();
  const id = params?.id as string;
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading: isFetching } = useQuery<FetchData>(
    ['events-locations-faculties'],
    () => fetchLocationsAndFaculties(id)
  );

  const mutation = useMutation(updateEvent, {
    onSuccess: () => {
      toast.success('Event updated successfully!');
      queryClient.invalidateQueries(['event-manager']);
      router.push('/manager/events');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update event');
    },
  });

  useEffect(() => {
    if (data) setPreviewUrl(events.image);
  }, [data]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.dismiss();

    const formData = new FormData(event.currentTarget);
    const date = formData.get('date') as string;
    const cleanedDateString = date.split('[')[0];
    const timestamp = new Date(cleanedDateString).getTime();
    formData.set('date', timestamp.toString());

    // Loại bỏ các giá trị trống
    for (const [key, value] of formData.entries()) {
      if (!value || value === '') {
        formData.delete(key); // Xóa các key có giá trị trống
      }
    }

    if (image) {
      formData.append('image', image);
    }

    mutation.mutate({ formData, id });
  };

  if (isFetching) {
    return <p>Loading...</p>;
  }

  const {
    events,
    locations = [],
    faculties = [],
  } = data || { events: {} as Event, locations: [], faculties: [] };

  return (
    <form
      className='space-y-4'
      onSubmit={onSubmit}
    >
      <Card className='py-4 w-full grid grid-cols-2'>
        <CardHeader className='pb-0 pt-2 px-4 gap-2 flex-col'>
          <Input
            label='Name'
            name='name'
            placeholder="Enter event's name"
            variant='flat'
            isRequired
            defaultValue={events.name}
          />

          <div className='grid grid-cols-2 gap-2 w-full'>
            <DatePicker
              hideTimeZone
              defaultValue={parseAbsoluteToLocal(events.date)}
              label='Event Date'
              name='date'
              variant='flat'
            />
            <Input
              label='Bonus point'
              name='bonus_points'
              placeholder="Enter event's bonus point"
              variant='flat'
              type='number'
              isRequired
              defaultValue={events.bonus_points?.toString()}
            />
          </div>
          <Select
            label='Select location'
            name='location_id'
            isRequired
            defaultSelectedKeys={[events.location_id]}
          >
            {locations.map((item) => (
              <SelectItem
                value={item._id}
                key={item._id}
              >
                {item.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label='Select faculty'
            name='faculty_id'
            defaultSelectedKeys={[events.faculty_id]}
          >
            {faculties.map((item) => (
              <SelectItem
                value={item._id}
                key={item._id}
              >
                {item.name}
              </SelectItem>
            ))}
          </Select>
          <Textarea
            label='Description'
            name='description'
            variant='flat'
            defaultValue={events.description}
          />
        </CardHeader>
        <CardBody className='overflow-visible py-2'>
          <Image
            removeWrapper
            alt='Card background'
            className='object-cover rounded-xl w-auto cursor-pointer'
            src={
              previewUrl || 'https://nextui.org/images/hero-card-complete.jpeg'
            }
            width={270}
            onClick={handleImageClick}
          />
          <input
            ref={fileInputRef}
            hidden
            type='file'
            onChange={handleImageChange}
          />
        </CardBody>
        <CardFooter className='flex gap-4'>
          <Button
            color='secondary'
            variant='flat'
            onPress={() => router.push('/events')}
          >
            Trở về
          </Button>
          <Button
            color='primary'
            isLoading={mutation.isLoading}
            type='submit'
          >
            Lưu
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
