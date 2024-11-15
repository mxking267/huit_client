'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/modal';
import { Input, Textarea } from '@nextui-org/input';
import { DatePicker } from '@nextui-org/date-picker';
import { now, getLocalTimeZone } from '@internationalized/date';
import { FormEvent, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@nextui-org/button';
import { Select, SelectItem } from '@nextui-org/select';
import { getAccessToken } from '../utils/getAccessToken';
import { Location } from '@/types/location';
import { Faculty } from '@/types/faculty';

const CreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [locationData, setLocationData] = useState<Location[]>([]);
  const [facultyData, setFacultyData] = useState<Faculty[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = useCallback(
    async (
      endpoint: string,
      setter: React.Dispatch<React.SetStateAction<any[]>>
    ) => {
      try {
        const res = await fetch(`${apiUrl}/${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });
        const result = await res.json();
        setter(result);
      } catch (error) {
        toast.error(`Failed to fetch ${endpoint}`);
      }
    },
    [apiUrl]
  );

  useEffect(() => {
    fetchData('location/all', setLocationData);
    fetchData('faculty/all', setFacultyData);
  }, [fetchData]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get('name'),
      description: formData.get('description'),
      location_id: formData.get('location_id'),
    };

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.EC === 0) {
        toast.success('Event created successfully');
      } else {
        toast.error('Error creating event');
      }
    } catch (error) {
      toast.error('Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelectOptions = (
    data: any[],
    valueKey: string,
    labelKey: string
  ) => {
    return data.map((item) => (
      <SelectItem
        value={item[valueKey]}
        key={item[valueKey]}
      >
        {item[labelKey]}
      </SelectItem>
    ));
  };

  return (
    <>
      <Button
        className='w-min self-end'
        color='primary'
        onPress={onOpen}
      >
        Create
      </Button>
      <Modal
        isKeyboardDismissDisabled
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <form
          className='space-y-4'
          onSubmit={onSubmit}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  Create event
                </ModalHeader>
                <ModalBody>
                  <Input
                    label='Event name'
                    name='name'
                    variant='flat'
                  />
                  <DatePicker
                    label='Event Date'
                    variant='flat'
                    hideTimeZone
                    showMonthAndYearPickers
                    defaultValue={now(getLocalTimeZone())}
                  />
                  <Select
                    label='Select location'
                    name='location_id'
                  >
                    {renderSelectOptions(locationData, '_id', 'name')}
                  </Select>

                  <Select
                    label='Select faculty'
                    name='faculty_id'
                  >
                    {renderSelectOptions(facultyData, '_id', 'name')}
                  </Select>

                  <Textarea
                    label='Description'
                    name='description'
                    variant='flat'
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color='danger'
                    variant='light'
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    type='submit'
                    color='primary'
                    isLoading={isLoading}
                    onPress={onClose}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default CreateEvent;
