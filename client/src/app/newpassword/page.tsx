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
import { NewPasswordTypeScript } from "./type";

export default function Resetpassword() {
    const initialValues: NewPasswordTypeScript = {
        Password: "",
    };

    const [serverError, setServerError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const router = useRouter();

    const handlesubmit = async (values: NewPasswordTypeScript) => {
        setServerError(null);
        setFieldErrors({});

        try {
            const res = await axios.post(
                "http://localhost:8080/api/v1/authentication/resetpassword",
                {
                    Password: values.Password,
                },
                { withCredentials: true }
            );
            console.log(res);
            router.push("/signin");
        } catch (error: any) {
            console.log(error);
            if (error.response?.data?.errors) {
                const errMap: Record<string, string[]> = {};

                error.response.data.errors.forEach(
                    (err: { field: string; message: string }) => {
                        if (!errMap[err.field]) {
                            errMap[err.field] = [];
                        }
                        errMap[err.field].push(err.message);
                    }
                );

                setFieldErrors(errMap);
            } else if (error.response?.data?.message) {
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
                            Reset Your Password
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-300 mt-1">
                            Enter your new password below
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 py-6">
                        <Formik initialValues={initialValues} onSubmit={handlesubmit}>
                            <Form className="space-y-4">
                                {serverError && (
                                    <div className="text-red-600 text-sm font-medium text-center">
                                        {serverError}
                                    </div>
                                )}

                                <Custominput
                                    label="New Password"
                                    name="Password"
                                    type="password"
                                    placeholder="Enter new password..."
                                />

                                {/* Show backend field validation errors */}
                                {fieldErrors["Password"] && (
                                    <ul className="text-red-600 text-sm list-disc pl-5 mt-1">
                                        {fieldErrors["Password"].map((msg, index) => (
                                            <li key={index}>{msg}</li>
                                        ))}
                                    </ul>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full py-2 text-base bg-sky-600 hover:bg-sky-700 flex items-center justify-center gap-2"
                                >
                                    <FaSignInAlt className="text-white text-lg" />
                                    Reset Password
                                </Button>
                            </Form>
                        </Formik>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
