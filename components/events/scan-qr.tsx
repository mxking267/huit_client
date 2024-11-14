import Html5QrcodePlugin from '@/config/Html5QrCodePlugin';
import { toast } from 'react-toastify';
import { getAccessToken } from '../utils/getAccessToken';

interface Props {
  eventId: string;
}

const QRScanner = ({ eventId }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  async function onScanSuccess(decodedText: string, decodedResult: any) {
    const data = JSON.parse(decodedText);
    const userId = data.userId;
    const usedFor = data.usedFor;
    if (decodedText) {
      try {
        const response = await fetch(`${apiUrl}/event/check-in-out`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify({
            userId,
            eventId,
            usedFor,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success('success');
        } else {
          throw result.message;
        }
      } catch (error) {
        toast.error(error + '');
      }
    }
  }

  return (
    <Html5QrcodePlugin
      fps={10}
      qrbox={250}
      disableFlip={false}
      qrCodeSuccessCallback={onScanSuccess}
    />
  );
};

export default QRScanner;
