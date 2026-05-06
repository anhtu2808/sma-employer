import React, { useRef } from 'react';
import Form from '@/components/Form';
import toastMessage from '@/utils/toastMessage';
import { useUploadFileMutation } from '@/apis/apis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage, faImage, faXmark } from '../../../utils/icons';

const CompanyImages = ({ form, onChange }) => {
    const fileInputRef = useRef(null);
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

    const images = Form.useWatch('images', form) || [];

    const setImages = (newImages) => {
        form.setFieldsValue({ images: newImages });
        if (onChange) onChange();
    };

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        console.log('[CompanyImages] handleUpload triggered, files selected:', files);
        if (!files.length) {
            console.warn('[CompanyImages] No files found in event.');
            return;
        }

        try {
            toastMessage.loading(`Starting upload...`);
            for (const file of files) {
                console.log(`[CompanyImages] Validating file: ${file.name}, type: ${file.type}`);
                const isImageMime = file.type && file.type.startsWith('image/');
                const isImageExt = !!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);

                if (!isImageMime && !isImageExt) {
                    console.error(`[CompanyImages] Validation failed for: ${file.name}`);
                    toastMessage.error(`"${file.name}" is not a valid image file`);
                    continue;
                }

                toastMessage.loading(`Uploading ${file.name}...`);

                const formData = new FormData();
                formData.append('files', file);

                console.log(`[CompanyImages] Sending POST request for: ${file.name}`);
                const response = await uploadFile(formData).unwrap();
                console.log(`[CompanyImages] Upload response:`, response);

                const downloadUrl = response[0]?.downloadUrl || response?.downloadUrl;

                if (downloadUrl) {
                    const currentImages = form.getFieldValue('images') || [];
                    setImages([...currentImages, { url: downloadUrl, description: '' }]);
                    toastMessage.success(`Uploaded "${file.name}"`);
                } else {
                    toastMessage.error(`Failed to get URL for "${file.name}"`);
                }
            }
        } catch (err) {
            console.error('[CompanyImages] Upload error:', err);
            toastMessage.error('Failed to upload image. Please try again.');
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = (index) => {
        const currentImages = form.getFieldValue('images') || [];
        const updated = currentImages.filter((_, i) => i !== index);
        setImages(updated);
    };

    const handleDescriptionChange = (index, value) => {
        const currentImages = form.getFieldValue('images') || [];
        const updated = currentImages.map((img, i) =>
            i === index ? { ...img, description: value } : img
        );
        setImages(updated);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                Company Images
            </h3>
            <Form.Item name="images" hidden>
                <input />
            </Form.Item>

            {/* Image grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, index) => (
                    <div
                        key={img.id || index}
                        className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Image preview */}
                        <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
                            <img
                                src={img.url}
                                alt={img.description || `Company image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div
                                className="w-full h-full items-center justify-center text-gray-400"
                                style={{ display: 'none' }}
                            >
                                <FontAwesomeIcon icon={faImage} className="text-4xl" />
                            </div>
                        </div>

                        {/* Description input */}
                        <div className="p-2">
                            <input
                                type="text"
                                value={img.description || ''}
                                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                placeholder="Add description..."
                                className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                            />
                        </div>

                        {/* Remove button */}
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg backdrop-blur-sm"
                            title="Remove image"
                        >
                            <FontAwesomeIcon icon={faXmark} className="text-sm" />
                        </button>
                    </div>
                ))}

                {/* Upload button card */}
                <div
                    className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary bg-gray-50/50 dark:bg-gray-800/50 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:bg-primary/5 group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleUpload}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {isUploading ? (
                        <>
                            <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
                            <span className="text-xs font-medium text-gray-500">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <FontAwesomeIcon icon={faFileImage} className="text-primary text-2xl" />
                            </div>
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Add Image</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">JPG, PNG</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyImages;
