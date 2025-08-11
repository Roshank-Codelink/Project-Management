"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Formik, Form } from "formik";
import Custominput from "../../components/Custominput";
import { FaSignInAlt } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SigninTypeScript } from "./type";
import { SigninvalidationSchma } from "./validation";
import { useAuth } from "@/contexts/AuthContext";

export default function Signin() {
    const initialValues: SigninTypeScript = {
        Email: "",
        Password: "",
    };

    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handlesubmit = async (values: SigninTypeScript) => {
        setServerError(null);
        setIsLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:8080/api/v1/authentication/signin",
                {
                    Email: values.Email,
                    Password: values.Password,
                },
                { withCredentials: true }
            );

            console.log(res.data.Userdata);

            // Use AuthContext login function
            login(res.data.token || res.data.accessToken, res.data.Userdata);

            // Always redirect to dashboard after successful login
            router.push('/dashboard');

        } catch (error: any) {
            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError("Something went wrong. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen px-4 py-6 bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: 'url("/p-1.png")' }}
        >
            <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl">
                <Card className="bg-transparent shadow-none">
                    <CardHeader className="bg-[#1e293b] text-center rounded-t-2xl py-4">
                        <div className="flex justify-center mb-2">
                            <Image
                                src="/logo-sm.png"
                                width={60}
                                height={60}
                                alt="logo"
                                className="rounded-full object-contain"
                            />
                        </div>
                        <CardTitle className="text-white text-lg font-semibold">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-300 mt-1">
                            Sign in to access your dashboard
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 py-4">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={SigninvalidationSchma}
                            onSubmit={handlesubmit}
                        >
                            <Form className="space-y-4">
                                {/* Server Error */}
                                {serverError && (
                                    <div className="text-red-600 text-sm font-medium text-center">
                                        {serverError}
                                    </div>
                                )}

                                {/* Email */}
                                <Custominput
                                    label="Email"
                                    name="Email"
                                    type="email"
                                    placeholder="Enter your email..."
                                />

                                {/* Password */}
                                <Custominput
                                    label="Password"
                                    name="Password"
                                    type="password"
                                    placeholder="Enter your password..."
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full bg-[#1e293b] hover:bg-[#334155] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Signing in...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FaSignInAlt className="w-4 h-4" />
                                            Sign In
                                        </div>
                                    )}
                                </Button>

                                {/* Forgot Password Link */}
                                <div className="text-center">
                                    <Link
                                        href="/emailverify"
                                        className="text-sm text-[#1e293b] hover:text-[#334155] transition-colors duration-200"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-gray-500">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                {/* Sign Up Link */}
                                <div className="text-center">
                                    <span className="text-sm text-gray-600">
                                        Don't have an account?{" "}
                                    </span>
                                    <Link
                                        href="/signup"
                                        className="text-sm text-[#1e293b] hover:text-[#334155] font-semibold transition-colors duration-200"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            </Form>
                        </Formik>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
