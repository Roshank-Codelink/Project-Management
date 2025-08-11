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
import { SignupvalidationSchma } from "./validation";
import Custominput from "../../components/Custominput";
import { FaSignInAlt } from "react-icons/fa";
import Link from "next/link";
import { SingupTypeScipt } from "./types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
    const initialValuess: SingupTypeScipt = {
        _id: "",
        Username: "",
        Email: "",
        Password: "",
        confirmPassword: "",
        Phone: null,
        Role: "",
        Department: "",
        ProfileImageUrl: "",
        IsActive: false,
        EmployeeId: "",

    };

    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();

    const handlesubmit = async (values: SingupTypeScipt) => {
        setServerError(null); // Clear previous error
        try {
            const res = await axios.post(
                "http://localhost:8080/api/v1/authentication/signup",
                {
                    Username: values.Username,
                    Email: values.Email,
                    Password: values.Password,
                    confirmPassword: values.confirmPassword,
                    Phone: values.Phone,
                    Role: values.Role,
                    Department: values.Department,
                },
                { withCredentials: true }
            );
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

                    <CardContent className="px-5 py-2">
                        <Formik
                            initialValues={initialValuess}
                            validationSchema={SignupvalidationSchma}
                            onSubmit={handlesubmit}
                        >
                            <Form className="space-y-2">
                                {/* Error message box */}
                                {serverError && (
                                    <div className="text-red-600 text-sm font-medium text-center">
                                        {serverError}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-1/2">
                                        <Custominput
                                            label="Username"
                                            name="Username"
                                            type="text"
                                            placeholder="Enter your username.."
                                        />
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                        <Custominput
                                            label="Email"
                                            name="Email"
                                            type="email"
                                            placeholder="Enter your email.."
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-1/2">
                                        <Custominput
                                            label="Password"
                                            name="Password"
                                            type="password"
                                            placeholder="Enter your password.."
                                        />
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                        <Custominput
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="Confirm your password.."
                                        />
                                    </div>
                                </div>

                                <Custominput
                                    label="Phone Number"
                                    name="Phone"
                                    type="tel"
                                    placeholder="Enter your phone number.."
                                />

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-1/2">
                                        <Custominput
                                            label="Department"
                                            name="Department"
                                            as="select"
                                            options={["HR", "IT", "Marketing", "Sales"]}
                                        />
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                        <Custominput
                                            label="Role"
                                            name="Role"
                                            as="select"
                                            options={["Manager", "TeamLeader", "Employee"]}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center text-sm text-[#000444] gap-2 pt-1">
                                    <Switch id="terms" className="data-[state=checked]:bg-sky-600" />
                                    <Label htmlFor="terms">
                                        By registering you agree to the Unikit{" "}
                                        <Link href="/terms" className="text-sky-600">
                                            Terms of Use
                                        </Link>
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer py-2 text-base bg-sky-600 hover:bg-sky-700 flex items-center justify-center gap-2"
                                >
                                    <FaSignInAlt className="text-white text-lg" /> Register
                                </Button>

                                <p className="text-center text-sm text-gray-600 pt-1">
                                    Already have an account?{" "}
                                    <Link href="/signin" className="text-sky-600 hover:underline">
                                        Log in
                                    </Link>
                                </p>
                            </Form>
                        </Formik>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
