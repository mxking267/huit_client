'use client';

import { title } from '@/components/primitives';
import UserTable from '@/components/users/table';

export default function UserPage() {
  return (
    <div>
      <h1 className={title()}>User</h1>
      <UserTable />
    </div>
  );
}
