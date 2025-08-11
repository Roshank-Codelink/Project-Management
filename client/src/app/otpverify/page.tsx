"use client";

import React, { useState } from "react";
import { Formik } from "formik";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { OtpSchemaYub } from "./validation";
import { OTPTypeScript } from "./type";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function OTPInputUI() {
    const initialOTPValue: OTPTypeScript = {
        Otp: null,
    };

    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handlesubmit = async (values: OTPTypeScript) => {
        const flowFromStorage = sessionStorage.getItem("otpFlow");

        const apiURL =
            flowFromStorage === "Forgot"
                ? "http://localhost:8080/api/v1/authentication/forgetverifyotp"
                : "http://localhost:8080/api/v1/authentication/verifyotp";

        try {
            setError(null); // Clear previous errors

            const res = await axios.post(
                apiURL,
                { Otp: values.Otp },
                { withCredentials: true }
            );
            console.log(res.data.message);
            const navigateto = flowFromStorage === "Forgot" ? "/newpassword" : "/signin";   
            router.push(navigateto);
            sessionStorage.removeItem("otpFlow");


        } catch (error: any) {
            console.error(error);
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: 'url("/p-1.png")' }}
        >
            <div className="bg-white w-full max-w-md p-6 sm:p-8 ">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1d4ed8] mb-2 text-center">
                    Enter OTP
                </h2>
                <p className="text-gray-500 text-sm sm:text-base mb-6 text-center">
                    We’ve sent a 6-digit code to your registered Email.
                </p>

                <Formik
                    initialValues={initialOTPValue}
                    validationSchema={OtpSchemaYub}
                    onSubmit={handlesubmit}
                >
                    {(formik) => (
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={6}
                                    onChange={(value) =>
                                        formik.setFieldValue("Otp", Number(value))
                                    }
                                    className="flex justify-center"
                                >
                                    <InputOTPGroup className="flex gap-2 sm:gap-3">
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                                className={`w-10 h-10 sm:w-12 sm:h-12 text-xl text-center rounded-lg border transition-all ${formik.touched.Otp && formik.errors.Otp
                                                    ? "border-red-500 focus:ring-red-400"
                                                    : "border-gray-300 focus:ring-[#1d4ed8]"
                                                    }`}
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            {/* Formik Validation Error */}
                            {formik.touched.Otp && formik.errors.Otp && (
                                <p className="text-red-500 text-sm text-center">
                                    {formik.errors.Otp}
                                </p>
                            )}

                            {/* Backend Error Message */}
                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}

                            <p className="text-sm text-gray-500 text-center">
                                Didn’t receive it?{" "}
                                <span className="text-[#1d4ed8] hover:underline cursor-pointer">
                                    Resend
                                </span>
                            </p>

                            <Button
                                type="submit"
                                className="w-full bg-sky-600 hover:bg-[#2563eb] text-white py-3 text-base rounded-xl font-medium transition-all"
                            >
                                Submit OTP
                            </Button>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
