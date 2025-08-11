"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Formik, Form } from "formik";
import Custominput from "../../components/Custominput";
import { FaSignInAlt } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmailVerifyTypeScript } from "./type";
import { EmailSchemaYub } from "./validation";

export default function Emailverify() {
    const initialValues: EmailVerifyTypeScript = {
        Email: "",
    };

    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();

    const handlesubmit = async (values: EmailVerifyTypeScript) => {
        setServerError(null);
        try {
            const res = await axios.post(
                "http://localhost:8080/api/v1/authentication/forgetpasswordemailverify",
                {
                    Email: values.Email,
                },
                { withCredentials: true }
            );
            sessionStorage.setItem("otpFlow", "Forgot");
            router.push("/otpverify");
        } catch (error: any) {
            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError("Something went wrong. Please try again later.");
            }
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen px-4 py-6 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/p-1.png")' }}
        >
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl">
                <Card className="bg-transparent shadow-none">
                    <CardHeader className="bg-[#1e293b] text-center rounded-t-2xl py-5">
                        <div className="flex justify-center mb-2">
                            <Image
                                src="/logo-sm.png"
                                width={60}
                                height={60}
                                alt="Logo"
                                className="rounded-full object-contain"
                            />
                        </div>
                        <CardTitle className="text-white text-xl font-bold tracking-wide">
                            Password Reset
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-300 mt-1">
                            Enter your email to receive reset instructions
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 py-6">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={EmailSchemaYub}
                            onSubmit={handlesubmit}
                        >
                            <Form className="space-y-4">
                                {serverError && (
                                    <div className="text-red-600 text-sm font-medium text-center">
                                        {serverError}
                                    </div>
                                )}

                                <Custominput
                                    label="Email"
                                    name="Email"
                                    type="email"
                                    placeholder="Enter your email..."
                                />

                                <Button
                                    type="submit"
                                    className="w-full py-2 text-base bg-sky-600 hover:bg-sky-700 flex items-center justify-center gap-2"
                                >
                                    <FaSignInAlt className="text-white text-lg" />
                                    Submit
                                </Button>
                            </Form>
                        </Formik>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
