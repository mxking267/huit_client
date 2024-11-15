'use client';

import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Image } from '@nextui-org/image';
import fetchWithAuth from '@/components/hooks/fetchWithAuth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { DatePicker } from '@nextui-org/date-picker';
import { now, getLocalTimeZone } from '@internationalized/date';
import { Location } from '@/types/location';
import { Select, SelectItem } from '@nextui-org/select';
import { getAccessToken } from '@/components/utils/getAccessToken';
import { Faculty } from '@/types/faculty';
import { useLocalStorage } from '@/components/hooks/useLocalStorage';
export default function CreateEventPage() {
  const [value] = useLocalStorage('access_token');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File>();
  const [location, setLocation] = useState<Location[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [previewUrl, setPreviewUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  console.log(value);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    try {
      const resLocation = await fetchWithAuth(`location/all`);
      setLocation(resLocation);
      const resFaculty = await fetchWithAuth(`faculty/all`);
      setFaculty(resFaculty);
    } catch (error) {
      toast.error(`Failed to fetch`);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    try {
      const formData = new FormData(event.currentTarget);
      const date = formData.get('date') as string;
      const cleanedDateString = date.split('[')[0];
      const timestamp = new Date(cleanedDateString).getTime();
      formData.append('date', timestamp.toString());
      formData.set('date', timestamp.toString());

      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`${apiUrl}/event/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: formData,
      });
      const result = await response.json();

      if (!result) {
        toast.error('Server error');
        return;
      }

      toast.success('Create success');
      router.push('/manager/events');
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

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
          />

          <div className='grid grid-cols-2 gap-2 w-full'>
            <DatePicker
              hideTimeZone
              defaultValue={now(getLocalTimeZone())}
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
            />
          </div>
          <Select
            label='Select location'
            name='location_id'
          >
            {location.map((item) => (
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
          >
            {faculty.map((item) => (
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
            Cancel
          </Button>
          <Button
            color='primary'
            isLoading={isLoading}
            type='submit'
          >
            Create
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
