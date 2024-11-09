export enum EEventStatus {
  INITIAL = 'initial',
  HAPPENING = 'happening',
  FINISH = 'finish',
}

export type Event = {
  _id: string;
  name: string;
  description: string;
  location_id: string;
  date_start: string;
  date_end: string;
  participants: Participant[];
  manager_id: string;
  createdAt: string;
  updatedAt: string;
  status: EEventStatus;
};

export type EventCreate = Omit<
  Event,
  '_id' | 'participants' | 'createdAt' | 'updatedAt' | 'status'
>;

export type Participant = {
  _id: string;
  user_id: string;
  check_in_status: boolean;
  check_out_status: boolean;
};
