import * as XLSX from 'xlsx';
import { EAttendanceStatus, EventParticipant } from '@/types/event';
import { saveAs } from 'file-saver';

type ColumnKey = 'Mã sinh viên' | 'Họ và Tên' | 'Lớp' | 'Trạng thái';

type RowData = {
  [key in ColumnKey]: string;
};

export const exportToExcel = (participants: EventParticipant[]) => {
  const getStatus = (status: EAttendanceStatus): string => {
    if (status === EAttendanceStatus.CHECKED_IN) return 'Đã check in';
    if (status === EAttendanceStatus.CHECKED_OUT) return 'Đã check out';
    if (status === EAttendanceStatus.PENDING) return 'Chưa check in';
    return 'Không xác định';
  };
  const transformData: RowData[] = participants.map((participant) => ({
    'Mã sinh viên': participant.student_code,
    'Họ và Tên': participant.full_name,
    Lớp: participant.class_name,
    'Trạng thái': getStatus(participant.status),
  }));

  const worksheet = XLSX.utils.json_to_sheet(transformData);

  const workbook = XLSX.utils.book_new();

  const columnWidths = Object.keys(transformData[0]).map((key) => ({
    wch: Math.max(
      key.length,
      ...transformData.map((row) =>
        row[key as ColumnKey] ? row[key as ColumnKey].toString().length : 0
      )
    ),
  }));

  worksheet['!cols'] = columnWidths;
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách tham gia');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(file, 'Participants.xlsx');
};
