import { EEventStatus, Event, getEventStatusTrans } from '@/types/event';
import { Chip } from '@nextui-org/chip';
import { Select, SelectedItems, SelectItem } from '@nextui-org/select';
import { useUpdateEventStatus } from '../hooks/useUpdateEventStatus';
import { ReactEventHandler, useState } from 'react';

interface Props {
  event: Event;
}

const ChangeStatusEvent = ({ event }: Props) => {
  const { mutate, isLoading } = useUpdateEventStatus();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e);
    const selectedStatus = e.target.value as EEventStatus;
    mutate({ id: event._id, status: selectedStatus });
  };
  return (
    <Select
      isLoading={isLoading}
      items={Object.values(EEventStatus).map((value) => ({
        value,
        label: value,
      }))}
      classNames={{
        base: 'w-full',
        trigger: 'h-12',
      }}
      defaultSelectedKeys={[event.status]}
      onChange={handleSelect}
      renderValue={(
        items: SelectedItems<{ value: EEventStatus; label: string }>
      ) => {
        return items.map((item) => (
          <Chip
            color={
              getEventStatusTrans(item.key as unknown as EEventStatus).color
            }
            variant='dot'
          >
            {getEventStatusTrans(item.key as unknown as EEventStatus).status}
          </Chip>
        ));
      }}
    >
      {(item) => (
        <SelectItem
          key={item.value}
          textValue={item.value}
        >
          {getEventStatusTrans(item.value as unknown as EEventStatus).status}
        </SelectItem>
      )}
    </Select>
  );
};

export default ChangeStatusEvent;
