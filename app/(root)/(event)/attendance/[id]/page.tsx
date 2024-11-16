'use client';

import { title } from '@/components/primitives';
import QRScanner from '@/components/events/scan-qr';
import { useParams } from 'next/navigation';
import ParticipantTable from '@/components/events/table-list-participants';

export default function AttendancePage() {
  const params = useParams();
  const id = params?.id as string;
  return (
    <div>
      <h1 className={title({ className: 'mb-4' })}>Điểm danh</h1>
      <div className='grid grid-cols-2 gap-4'>
        <QRScanner eventId={id} />
        <div>
          <h6>Danh sách</h6>
          <ParticipantTable eventId={id} />
        </div>
      </div>
    </div>
  );
}
