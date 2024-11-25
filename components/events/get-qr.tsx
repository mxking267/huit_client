'use client';

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
import DownloadImage from '../utils/save-image';
import fetchWithAuth from '../hooks/fetchWithAuth';

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
      const res = await fetchWithAuth(`event/qr/${eventId}`);
      setQR(res.qr_code);
      onOpen();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const shareViaZalo = (shareText: string, imageUrl: string) => {
    const shareUrl = `https://zalo.me/share?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(imageUrl)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <>
      <Button
        color='success'
        isLoading={isLoading}
        radius='full'
        size='sm'
        variant='bordered'
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
                        <DownloadImage
                          url={qrCode.qr_code_cki}
                          name='qr-check-in'
                        />
                      </div>
                      <div>
                        <h1>Check out</h1>
                        <img
                          src={qrCode.qr_code_cko}
                          alt='QR Code checkout'
                        />
                        <DownloadImage
                          url={qrCode.qr_code_cko}
                          name='qr-check-out'
                        />
                        <Button
                          onPress={() =>
                            shareViaZalo(
                              'Hãy xem hình ảnh này nhé!',
                              'https://github.com/shadcn.png'
                            )
                          }
                        >
                          Gửi qua zalo
                        </Button>
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
