import { Button } from '@nextui-org/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';

interface Html5QrcodePluginProps {
  fps: number;
  qrbox?: number | { width: number; height: number };
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
  qrCodeErrorCallback?: (errorMessage: string) => void;
}

const qrcodeRegionId = 'html5qr-code-full-region';

const createConfig = (
  props: Html5QrcodePluginProps
): {
  fps: number;
  qrbox?: number | { width: number; height: number };
  aspectRatio?: number;
  disableFlip?: boolean;
} => {
  let config: {
    fps: number;
    qrbox?: number | { width: number; height: number };
    aspectRatio?: number;
    disableFlip?: boolean;
  } = { fps: 10 };

  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = (props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [decodedText, setDecodedText] = useState<string>('');
  const [decodedResult, setDecodedResult] = useState<any>(null);
  const [decodedData, setDecodedData] = useState<any>(null);
  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw 'qrCodeSuccessCallback is required callback.';
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );
    html5QrcodeScanner.render((decodedText, decodedResult) => {
      // Lưu mã QR và kết quả quét vào trạng thái, nhưng chưa gọi callback
      setDecodedText(decodedText);
      try {
        const parsedData = JSON.parse(decodedText);
        setDecodedData(parsedData); // Lưu đối tượng tách được vào state
      } catch (e) {
        console.error('Failed to parse QR data:', e);
        setDecodedData(null); // Nếu không thể parse, reset dữ liệu
      }
      onOpen();
    }, props.qrCodeErrorCallback);

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error('Failed to clear html5QrcodeScanner. ', error);
      });
    };
  }, []);

  // Xử lý đóng popup và tiếp tục quét
  const handlePopupConfirm = () => {
    props.qrCodeSuccessCallback(decodedText, decodedResult);
    onClose();
  };

  return (
    <div>
      <div id={qrcodeRegionId} />
      <Modal
        backdrop='opaque'
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Thông tin
              </ModalHeader>
              <ModalBody>
                <p>
                  <strong>Họ và tên:</strong> {decodedData.full_name}
                </p>
                <p>
                  <strong>Email:</strong> {decodedData.email}
                </p>
                <p>
                  <strong>Dùng cho:</strong> {decodedData.usedFor}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  onPress={onClose}
                >
                  Huỷ bỏ
                </Button>
                <Button
                  color='primary'
                  onPress={handlePopupConfirm}
                >
                  Xác nhận
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Html5QrcodePlugin;
