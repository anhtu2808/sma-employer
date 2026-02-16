import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import Button from '@/components/Button';

const PendingApproval = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#FCFCFD] overflow-hidden p-6 font-body">
            <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-orange-400/10 rounded-full blur-[80px]" />
            <div className="absolute top-[20%] right-[10%] w-[25%] h-[25%] bg-primary/5 rounded-full blur-[60px]" />

            <Card className="relative z-10 max-w-lg w-full !p-12 border border-neutral-100 bg-white/80 backdrop-blur-md shadow-[0_20px_50px_rgba(255,107,53,0.12)]">
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 bg-primary/15 rounded-full animate-ping" />
                        <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-primary to-[#FF9E7D] rounded-full shadow-[0_8px_20px_rgba(255,107,53,0.3)]">
                            <span className="material-icons-round text-white text-5xl">pending_actions</span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-neutral-900 mb-4 font-heading tracking-tight">
                        Application Under Review
                    </h2>

                    <div className="space-y-4 text-neutral-600 leading-relaxed font-body">
                        <p className="font-medium">
                            Your registration has been successfully submitted.
                        </p>
                        <p className="text-sm">
                            Our administrators are currently verifying your <span className="text-primary font-semibold">Tax ID</span> and <span className="text-primary font-semibold">ERC document</span>.
                            This verification process typically takes up to <span className="font-bold text-neutral-900">24 business hours</span>.
                        </p>
                    </div>

                    <div className="mt-10 space-y-4">
                        <Button
                            mode="primary"
                            fullWidth
                            size="lg"
                            onClick={() => navigate('/')}
                        >
                            Return to Homepage
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                            <span className="material-icons-round text-sm">mail</span>
                            <span>We'll notify you via email once your account is activated.</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Footer Decor */}
            <div className="absolute bottom-8 text-neutral-400 text-[10px] uppercase font-bold tracking-[0.25em]">
                SmartRecruit Verification
            </div>
        </div>
    );
};

export default PendingApproval;