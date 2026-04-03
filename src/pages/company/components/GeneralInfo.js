import React, { useRef } from 'react';
import Input from '@/components/Input';
import Form from '@/components/Form';
import SimpleTextEditor from '@/components/SimpleTextEditor';
import toastMessage from '@/utils/toastMessage';
import { useUploadFileMutation } from '@/apis/apis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faImage, faFileImage } from '../../../utils/icons';

const GeneralInfo = ({ form, isEditing }) => {
    const fileInputRef = useRef(null);
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

    const logoValue = Form.useWatch('logo', form);
    const logoUrl = Array.isArray(logoValue) ? logoValue[0]?.url : logoValue;

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isImageMime = file.type && file.type.startsWith('image/');
        const isImageExt = !!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);

        if (!isImageMime && !isImageExt) {
            toastMessage.error(`"${file.name}" is not a valid image file`);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('files', file);

            const response = await uploadFile(formData).unwrap();
            const downloadUrl = response?.[0]?.downloadUrl;

            if (downloadUrl) {
                form.setFieldsValue({
                    logo: [{
                        uid: '-1',
                        name: file.name,
                        status: 'done',
                        url: downloadUrl
                    }]
                });
                toastMessage.success('Logo uploaded successfully');
            }
        } catch (err) {
            toastMessage.error('Failed to upload logo');
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2 italic">
                General Information
            </h3>

            <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex flex-col gap-3">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                        Company Logo
                    </label>
                    <div className="w-32 h-32">
                        {isEditing ? (
                            <div
                                className="relative h-full w-full rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary bg-gray-50/50 dark:bg-gray-800/50 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:bg-primary/5 group overflow-hidden"
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                            >
                                {logoUrl ? (
                                    <>
                                        <img
                                            src={logoUrl}
                                            alt="Logo"
                                            className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <FontAwesomeIcon icon={faCloudArrowUp} className="text-white text-xl" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <FontAwesomeIcon icon={faFileImage} className="text-primary text-xl" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Add Logo</span>
                                    </div>
                                )}
                                <div className="fallback-icon hidden flex-col items-center text-gray-400">
                                    <FontAwesomeIcon icon={faImage} className="text-3xl mb-1" />
                                </div>
                                {isUploading && (
                                    <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center z-10">
                                        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full w-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <FontAwesomeIcon icon={faImage} className="text-gray-300 text-3xl" />
                                )}
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleLogoUpload}
                    />
                </div>

                <div className="flex-1 w-full">
                    <Form.Item
                        name="name"
                        label="Company Name"
                        rules={[{ required: true, message: 'Please enter company name' }]}
                    >
                        <Input placeholder="Enter company name" />
                    </Form.Item>
                </div>

                <div className="flex-1 w-full">
                    <Form.Item
                        name="link"
                        label="Website"
                        rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                    >
                        <Input placeholder="https://..." />
                    </Form.Item>
                </div>
            </div>

            <div className="w-full">
                <Form.Item name="description" label="Description">
                    <SimpleTextEditor placeholder="Introduce your company..." />
                </Form.Item>
            </div>

            <Form.Item name="logo" hidden>
                <Input />
            </Form.Item>
        </div>
    );
};

export default GeneralInfo;