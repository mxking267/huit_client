'use client';

import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Image } from '@nextui-org/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { DatePicker } from '@nextui-org/date-picker';
import { now, getLocalTimeZone } from '@internationalized/date';
import { Select, SelectItem } from '@nextui-org/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccessToken } from '@/components/utils/getAccessToken';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import { Location } from '@/types/location';
import { Faculty } from '@/types/faculty';
import { EEventType } from '@/types/event';

const fetchLocationsAndFaculties = async () => {
  const [locations, faculties] = await Promise.all([
    fetchWithAuth(`location/all`),
    fetchWithAuth(`faculty/all`),
  ]);
  return { locations, faculties };
};

const createEvent = async (formData: FormData) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/event/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create event');
  }

  return response.json();
};

export default function CreateEventPage() {
  const [image, setImage] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading: isFetching } = useQuery(
    ['locations-faculties'],
    fetchLocationsAndFaculties
  );

  const mutation = useMutation(createEvent, {
    onSuccess: () => {
      toast.success('Event created successfully!');
      queryClient.invalidateQueries(['event-manager']);
      router.push('/manager/events');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event');
    },
  });

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
    formData.append('date', timestamp.toString());
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

    mutation.mutate(formData);
  };

  if (isFetching) {
    return <p>Loading...</p>;
  }

  const { locations = [], faculties = [] } = data || {};

  return (
    <form
      className='space-y-4'
      onSubmit={onSubmit}
    >
      <Card className='py-4 w-full grid grid-cols-2'>
        <CardHeader className='pb-0 pt-2 px-4 gap-2 flex-col'>
          <Input
            label='Tên sự kiện'
            name='name'
            variant='flat'
            isRequired
          />

          <div className='grid grid-cols-2 gap-2 w-full'>
            <DatePicker
              hideTimeZone
              defaultValue={now(getLocalTimeZone())}
              label='Ngày diễn ra'
              name='date'
              variant='flat'
            />
            <Input
              label='Điểm rèn luyện'
              name='bonus_points'
              placeholder="Enter event's bonus point"
              variant='flat'
              type='number'
              isRequired
            />
          </div>
          <Select
            label='Địa điểm'
            name='location_id'
            isRequired
          >
            {locations.map((item: Location) => (
              <SelectItem
                value={item._id}
                key={item._id}
              >
                {item.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label='Loại sự kiện'
            name='type'
            isRequired
          >
            {Object.values(EEventType).map((type) => (
              <SelectItem
                value={type}
                key={type}
              >
                {type}
              </SelectItem>
            ))}
          </Select>
          <Select
            description='Bỏ qua nếu là sự kiện toàn trường'
            label='Chọn khoa'
            name='faculty_id'
          >
            {faculties.map((item: Faculty) => (
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
            Tạo
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
