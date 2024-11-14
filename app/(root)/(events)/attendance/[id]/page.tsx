'use client';

import { title } from '@/components/primitives';
import QRScanner from '@/components/events/scan-qr';
import { useParams } from 'next/navigation';

export default function AttendancePage() {
  const params = useParams();
  const id = params?.id as string;
  return (
    <div>
      <h1 className={title()}>Attendance</h1>
      <div className='grid grid-cols-2 gap-4'>
        <QRScanner eventId={id} />
        <div>
          <h6>List check-in</h6>
          <div>
            <span>ABCDE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
