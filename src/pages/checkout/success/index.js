import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";

const PaymentSuccessful = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center w-full min-h-screen p-4 bg-[#f8f9fa]">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-[#f1f3f9] p-8 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <span className="material-icons-round text-5xl text-green-500">check_circle</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Thank you for your purchase. Your subscription has been activated successfully. You can now enjoy all the benefits of your new plan.
                </p>
                <Button
                    onClick={() => navigate("/dashboard")}
                    mode="primary"
                    shape="rounded"
                    size="lg"
                    className="w-full text-white font-semibold"
                >
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default PaymentSuccessful;
