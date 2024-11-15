'use client';

import dynamic from 'next/dynamic';

const ClientOnlyUserTable = dynamic(() => import('@/components/users/table'), {
  ssr: false,
});

import { title } from '@/components/primitives';

export default function UserPage() {
  return (
    <div>
      <h1 className={title()}>User</h1>
      <ClientOnlyUserTable />
    </div>
  );
}
