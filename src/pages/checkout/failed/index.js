import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";

const PaymentFailed = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center w-full min-h-screen p-4 bg-[#f8f9fa]">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-[#f1f3f9] p-8 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <span className="material-icons-round text-5xl text-red-500">error</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    We're sorry, but your payment could not be processed. Please check your payment details or try again. If the problem persists, contact support.
                </p>
                <div className="flex flex-col gap-3 w-full">
                    <Button
                        onClick={() => navigate(-1)}
                        mode="primary"
                        shape="rounded"
                        size="lg"
                        className="w-full text-white font-semibold"
                    >
                        Try Again
                    </Button>
                    <Button
                        onClick={() => navigate("/billing-plans")}
                        mode="secondary"
                        shape="rounded"
                        size="lg"
                        className="w-full font-semibold"
                    >
                        View Plans
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
