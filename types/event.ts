export enum EEventType {
  SCIENTIFIC_RESEARCH = 'SCIENTIFIC_RESEARCH',
  MOVEMENT = 'MOVEMENT',
  SEMINAR = 'SEMINAR',
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
  faculty_id: {
    _id: string;
    name: string;
  };
  date: string;
  participants: Participant[];
  manager_id: string;
  createdAt: string;
  updatedAt: string;
  bonus_points: number;
  type: EEventType;
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

export const getEventStatusTrans = (type: EEventType): string => {
  const uppercaseStatus = type ? type.toUpperCase() : '';
  if (uppercaseStatus === EEventType.MOVEMENT) return 'Phong trào';
  if (uppercaseStatus === EEventType.SCIENTIFIC_RESEARCH)
    return 'Nghiên cứu khoa học';
  if (uppercaseStatus === EEventType.SEMINAR) return 'Hội thảo';
  return type;
};
