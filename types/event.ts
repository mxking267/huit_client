export enum EEventStatus {
  INITIAL = 'INITIAL',
  HAPPENING = 'HAPPENING',
  FINISHED = 'FINISHED',
  STOPPED = 'STOPPED',
}

export enum EAttendanceStatus {
  PENDING = 'PENDING',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
}

export type Event = {
  _id: string;
  name: string;
  description: string;
  location_id: string;
  date: string;
  participants: Participant[];
  manager_id: string;
  createdAt: string;
  updatedAt: string;
  bonus_points: number;
  status: EEventStatus;
  image: string;
};

export type EventParticipant = {
  _id: string;
  full_name: string;
  student_code: string;
  class_name: string;
  status: EAttendanceStatus;
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
