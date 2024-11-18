export enum ERole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

export type User = {
  _id: string;
  full_name: string;
  email: string;
  role: ERole;
  student_code: string;
  class: string;
};
