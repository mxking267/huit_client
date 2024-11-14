import { Button } from '@nextui-org/button';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { getAccessToken } from '../utils/getAccessToken';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal';


const GetQR = ({ eventId }: { eventId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [qrCode, setQR] = useState<{
    qr_code_cki: string;
    qr_code_cko: string;
  }>();
  const handleGetQR = async () => {
    setIsLoading(true);
    toast.dismiss();
    try {
      const res = await fetch(
        `http://127.0.0.1:8080/api/v1/event/qr/${eventId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );
      const result = await res.json();
      setQR(result.qr_code);
      onOpen();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        color='primary'
        isLoading={isLoading}
        radius='full'
        size='sm'
        variant='solid'
        onClick={handleGetQR}
      >
        Lấy QR
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>QR</ModalHeader>
              <ModalBody>
                <div>
                  {qrCode ? (
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <h1>Check in</h1>
                        <img
                          src={qrCode.qr_code_cki}
                          alt='QR Code checkin'
                        />
                      </div>
                      <div>
                        <h1>Check out</h1>
                        <img
                          src={qrCode.qr_code_cko}
                          alt='QR Code checkout'
                        />
                      </div>
                    </div>
                  ) : (
                    <p>Đang tải QR code...</p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default GetQR;
