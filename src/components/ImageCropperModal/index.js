import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import getCroppedImg from './cropImage';

const ImageCropperModal = ({ isOpen, onClose, imageSrc, onCropComplete, aspect = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      if (!croppedAreaPixels || !imageSrc) return null;
      setIsProcessing(true);
      const { file, url } = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      onCropComplete({ file, url });
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  }, [imageSrc, croppedAreaPixels, onCropComplete]);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="Crop Image"
      width={600}
      onSubmit={showCroppedImage}
      submitText="Apply Crop"
      submitDisabled={!imageSrc}
      loading={isProcessing}
      loadingText="Processing..."
    >
      <div className="relative w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        )}
      </div>
      <div className="mt-4 px-4 flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Zoom</span>
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
    </Modal>
  );
};

export default ImageCropperModal;
