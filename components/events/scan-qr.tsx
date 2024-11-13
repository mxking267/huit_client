import Html5QrcodePlugin from '@/config/Html5QrCodePlugin';
import { toast } from 'react-toastify';
import { getAccessToken } from '../utils/getAccessToken';

const QRScanner = () => {
  //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // const apiUrl = 'http://127.0.0.1:8080/api/v1';
  async function onScanSuccess(decodedText: string, decodedResult: any) {
    const data = JSON.parse(decodedText);
    const userId = data.userId;
    const eventId = data.eventId;
    if (decodedText) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8080/api/v1/event/check-in-out`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify({
              userId,
              eventId,
              status: 'CHECK_IN',
            }),
          }
        );

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
