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

export type AttendanceStatus = {
  status: string;
  color: 'warning' | 'primary' | 'success' | 'default';
};

export const getAttendance = (attendanceStatus: string): AttendanceStatus => {
  if (attendanceStatus === 'PENDING')
    return { status: 'Chưa check in', color: 'warning' };
  if (attendanceStatus === 'CHECKED_IN')
    return { status: 'Đã check in', color: 'primary' };
  if (attendanceStatus === 'CHECKED_OUT')
    return { status: 'Đã check out', color: 'success' };
  return { status: 'None', color: 'default' };
};

export type EventStatusTrans = {
  status: string;
  color: 'warning' | 'primary' | 'success' | 'default' | 'danger';
};

export const getEventStatusTrans = (status: EEventStatus): EventStatusTrans => {
  const uppercaseStatus = status.toUpperCase();
  if (uppercaseStatus === EEventStatus.INITIAL)
    return { status: 'Mới', color: 'primary' };
  if (uppercaseStatus === EEventStatus.HAPPENING)
    return { status: 'Đang diễn ra', color: 'warning' };
  if (uppercaseStatus === EEventStatus.FINISHED)
    return { status: 'Đã xong', color: 'success' };
  if (uppercaseStatus === EEventStatus.STOPPED)
    return { status: 'Đã dừng lại', color: 'danger' };
  return { status: 'None', color: 'default' };
};
