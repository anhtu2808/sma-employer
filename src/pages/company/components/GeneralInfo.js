import React, { useRef, useState } from 'react';
import Input from '@/components/Input';
import Form from '@/components/Form';
import SimpleTextEditor from '@/components/SimpleTextEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@/utils/icons';
import { useUploadFileMutation } from '@/apis/apis';
import toastMessage from '@/utils/toastMessage';
import ImageCropperModal from '@/components/ImageCropperModal';

const GeneralInfo = ({ form, isEditing }) => {
    const fileInputRef = useRef(null);
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
    const [cropperModalOpen, setCropperModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);

    const currentLogo = Form.useWatch('logo', form);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isImageMime = file.type && file.type.startsWith('image/');
        const isImageExt = !!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);

        if (!isImageMime && !isImageExt) {
            toastMessage.error(`Please select a valid image file.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImageToCrop(reader.result);
            setCropperModalOpen(true);
        };
        reader.readAsDataURL(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCropComplete = async ({ file }) => {
        setCropperModalOpen(false);
        const loadingId = toastMessage.loading(`Uploading logo...`);
        try {
            const formData = new FormData();
            formData.append('files', file, 'logo.jpg');

            const response = await uploadFile(formData).unwrap();
            const downloadUrl = response[0]?.downloadUrl || response?.downloadUrl;

            toastMessage.dismiss(loadingId);

            if (downloadUrl) {
                form.setFieldsValue({ logo: downloadUrl });
                toastMessage.success(`Logo uploaded successfully`);
            } else {
                toastMessage.error(`Failed to get URL for logo`);
            }
        } catch (err) {
            console.error('Logo upload error:', err);
            toastMessage.dismiss(loadingId);
            toastMessage.error('Failed to upload logo.');
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">General Information</h3>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Logo section */}
                <div className="flex flex-col items-center gap-2 mt-4 md:mt-0 basis-[160px] shrink-0">
                    <Form.Item name="logo" hidden><input /></Form.Item>
                    <div
                        className={`relative w-32 h-32 rounded-xl border-2 ${isEditing ? 'border-dashed border-primary/50 hover:border-primary cursor-pointer' : 'border-solid border-gray-200'} overflow-hidden flex items-center justify-center bg-gray-50`}
                        onClick={() => isEditing && !isUploading && fileInputRef.current?.click()}
                    >
                        {currentLogo ? (
                            <img src={currentLogo} alt="Company Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400 text-sm font-medium">Logo</span>
                        )}

                        {isEditing && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <FontAwesomeIcon icon={faCamera} className="text-white text-xl" />
                            </div>
                        )}

                        {isUploading && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                            className="text-xs text-primary font-medium hover:opacity-80 transition-opacity tracking-wide mt-1"
                        >
                            Change Logo
                        </button>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

                <div className="flex-1 grid grid-cols-1 gap-6 ml-4">
                    <Form.Item
                        name="name"
                        label="Company Name"
                        rules={[{ required: true, message: 'Please enter company name' }]}
                    >
                        <Input placeholder="Enter company name" />
                    </Form.Item>
                    <Form.Item
                        name="link"
                        label="Website"
                        rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                    >
                        <Input placeholder="https://..." />
                    </Form.Item>
                </div>
            </div>

            <div className="col-span-full">
                <Form.Item
                    name="description"
                    label="Description"
                >
                    <SimpleTextEditor placeholder="Introduce your company..." />
                </Form.Item>
            </div>

            {cropperModalOpen && (
                <ImageCropperModal
                    isOpen={cropperModalOpen}
                    onClose={() => setCropperModalOpen(false)}
                    imageSrc={imageToCrop}
                    onCropComplete={handleCropComplete}
                    aspect={1}
                />
            )}
        </div>
    );
};

export default GeneralInfo;
