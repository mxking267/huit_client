import { Button } from '@nextui-org/button';
import { saveAs } from 'file-saver';

interface Props {
  url: string;
  name?: string;
}

const DownloadImage = ({ url, name = 'image.jpg' }: Props) => {
  const downloadImage = () => {
    saveAs(url, name);
  };

  return (
    <Button
      className='w-full'
      onClick={downloadImage}
    >
      Tải xuống
    </Button>
  );
};

export default DownloadImage;
