import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterRecruiterMutation, useUploadFileMutation } from '@/apis/apis';

import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Logo from '@/components/Logo';

const RecruiterRegister = () => {
    const navigate = useNavigate();
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
    const [register, { isLoading: isRegistering }] = useRegisterRecruiterMutation();
    const emailRef = useRef(null);
    const taxIdRef = useRef(null);
    const generalErrorRef = useRef(null);
    const [ercFile, setErcFile] = useState(null);
    const [errors, setErrors] = useState({
        recruiterEmail: "",
        taxIdentificationNumber: "",
        general: ""
    });

    const [formData, setFormData] = useState({
        recruiterEmail: "",
        password: "",
        companyName: "",
        description: "",
        companyIndustry: "",
        size: "",
        companyEmail: "",
        phone: "",
        address: "",
        country: "Vietnam",
        taxIdentificationNumber: "",
        companyLink: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name] || errors.general) {
            setErrors(prev => ({ ...prev, [name]: "", general: "" }));
        }
    };

    const handleFileChange = (e) => {
        setErcFile(e.target.files[0]);
    };

    const scrollToElement = (ref) => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ recruiterEmail: "", taxIdentificationNumber: "", general: "" });

        if (!ercFile) {
            const msg = "Please upload your Business License (ERC).";
            setErrors(prev => ({ ...prev, general: msg }));
            setTimeout(() => scrollToElement(generalErrorRef), 100);
            return;
        }

        try {
            const fileData = new FormData();
            fileData.append('files', ercFile);
            const uploadResponse = await uploadFile(fileData).unwrap();
            const ercUrl = uploadResponse[0].downloadUrl;
            const finalRequest = {
                ...formData,
                erc: ercUrl
            };

            await register(finalRequest).unwrap();
            navigate('/register/pending-approval');

        } catch (err) {
            console.error("Registration Error:", err);
            const apiMessage = err.data?.message;
            if (apiMessage === "Email already exists") {
                setErrors(prev => ({
                    ...prev,
                    recruiterEmail: "This email is already in use. Please try another one."
                }));
                setTimeout(() => scrollToElement(emailRef), 100);
            } else if (apiMessage === "Company already registered") {
                setErrors(prev => ({
                    ...prev,
                    taxIdentificationNumber: "This Tax ID has already been registered."
                }));
                setTimeout(() => scrollToElement(taxIdRef), 100);
            } else {
                setErrors(prev => ({
                    ...prev,
                    general: apiMessage || "A server error occurred. Please try again later."
                }));
                setTimeout(() => scrollToElement(generalErrorRef), 100);
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-[#FCFCFD] py-16 px-6 font-body overflow-hidden">
            <div className="absolute top-[-5%] right-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[5%] left-[-10%] w-[40%] h-[40%] bg-orange-400/5 rounded-full blur-[80px]" />
            <div className="absolute top-[30%] left-[10%] w-[20%] h-[20%] bg-primary/5 rounded-full blur-[60px]" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="flex justify-center mb-10">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-neutral-100">
                        <Logo size="lg" />
                    </div>
                </div>

                <header className="text-center mb-12">
                    <h1 className="text-4xl font-black text-neutral-900 font-heading tracking-tight mb-3">
                        Join as a <span className="text-primary">Recruiter</span>
                    </h1>
                    <p className="text-neutral-500 max-w-md mx-auto">
                        Empower your hiring process with AI-driven candidate matching and verification.
                    </p>
                </header>

                <Card className="!p-10 border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(255,107,53,0.1)] rounded-[2rem]">
                    <form onSubmit={handleSubmit} className="space-y-12">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="col-span-full flex items-center gap-3">
                                <div className="w-1 h-6 bg-primary rounded-full" />
                                <h3 className="text-lg font-bold text-neutral-900">Account Access</h3>
                            </div>
                            <div ref={emailRef}>
                                <Input
                                    label={<>Recruiter Email <span className="text-red-500">*</span></>}
                                    name="recruiterEmail"
                                    type="email"
                                    required
                                    onChange={handleChange}
                                    error={!!errors.recruiterEmail}
                                    helperText={errors.recruiterEmail}
                                />
                            </div>
                            <Input.Password
                                label={<>Password <span className="text-red-500">*</span></>}
                                name="password"
                                required
                                onChange={handleChange}
                                className="!rounded-xl"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="col-span-full flex items-center gap-3">
                                <div className="w-1 h-6 bg-primary rounded-full" />
                                <h3 className="text-lg font-bold text-neutral-900">Company Profile</h3>
                            </div>
                            <Input label={<>Company Name <span className="text-red-500">*</span></>} name="companyName" required onChange={handleChange} />
                            <Input label={<>Industry <span className="text-red-500">*</span></>} name="companyIndustry" required onChange={handleChange} />
                            <Input label={<>Company Size <span className="text-red-500">*</span></>} name="size" placeholder="e.g. 50-100" required onChange={handleChange} />
                            <div ref={taxIdRef}>
                                <Input
                                    label={<>Tax ID <span className="text-red-500">*</span></>}
                                    name="taxIdentificationNumber"
                                    required
                                    onChange={handleChange}
                                    error={!!errors.taxIdentificationNumber}
                                    helperText={errors.taxIdentificationNumber}
                                />
                            </div>
                            <Input label={<>Company Email <span className="text-red-500">*</span></>} name="companyEmail" type="email" required onChange={handleChange} />
                            <Input label={<>Phone Number <span className="text-red-500">*</span></>} name="phone" required onChange={handleChange} />

                            <div className="col-span-full">
                                <Input.TextArea
                                    label={<>Description <span className="text-red-500">*</span></>}
                                    name="description"
                                    placeholder="Tell us about your company mission..."
                                    required
                                    rows={3}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-span-full">
                                <Input label={<>Office Address <span className="text-red-500">*</span></>} name="address" required onChange={handleChange} />
                            </div>
                            <Input label="Country" name="country" placeholder="Vietnam" onChange={handleChange} />
                            <Input label="Website" name="companyLink" placeholder="https://..." onChange={handleChange} />
                        </div>

                        <div className="space-y-6 pt-4">
                            <div className="col-span-full flex items-center gap-3">
                                <div className="w-1 h-6 bg-primary rounded-full" />
                                <h3 className="text-lg font-bold text-neutral-900">Compliance Documents</h3>
                            </div>

                            <div className="bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800/50 p-8 rounded-3xl border border-neutral-200/60 shadow-inner">
                                <label className="block text-sm font-bold mb-5 text-neutral-700 dark:text-neutral-300">
                                    Business License / ERC File <span className="text-red-500">*</span>
                                </label>

                                <div className="flex flex-col lg:flex-row gap-10 items-center">
                                    <div className="flex-1 w-full">
                                        <div className="relative group cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary transition-all bg-white/50 rounded-2xl p-10 text-center shadow-sm">
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                required
                                                onChange={handleFileChange}
                                            />
                                            <div className="relative z-10">
                                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                    <span className="material-icons-round text-primary text-3xl">file_upload</span>
                                                </div>
                                                <p className="text-sm font-bold text-neutral-900">
                                                    {ercFile ? ercFile.name : "Choose or drag file here"}
                                                </p>
                                                <p className="text-xs text-neutral-400 mt-2">PDF, JPG, PNG (Max. 5MB)</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:block w-40 shrink-0 text-center">
                                        <p className="text-[10px] font-bold text-neutral-400 mb-2 tracking-widest">
                                            Illustration
                                        </p>
                                        <div className="p-2 bg-white dark:bg-neutral-900 rounded border border-neutral-100 dark:border-neutral-800 shadow-sm opacity-50">
                                            <img
                                                src="https://aztax.com.vn/wp-content/uploads/2024/11/mau-giay-chung-nhan-dang-ky-doanh-nghiep-1.jpg"
                                                alt="ERC Illustration"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div ref={generalErrorRef}>
                            {errors.general && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-2 animate-shake">
                                    <span className="material-icons-round text-base">error_outline</span>
                                    {errors.general}
                                </div>
                            )}
                        </div>

                        <div className="pt-6">
                            <Button
                                mode="primary"
                                fullWidth
                                size="lg"
                                type="submit"
                                disabled={isUploading || isRegistering}
                            >
                                {isUploading ? "Uploading Document..." : isRegistering ? "Submitting..." : "Submit for Approval"}
                            </Button>
                        </div>
                    </form>
                </Card>

                <footer className="mt-12 text-center text-[10px] text-neutral-400 uppercase tracking-[0.3em]">
                    SmartRecruit AI Security Protocol
                </footer>
            </div>
        </div>
    );
};

export default RecruiterRegister;