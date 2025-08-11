"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "../../components/app-sidebar";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface LayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const paths = pathname
        .split("/")
        .filter((segment) => segment && segment !== "dashboard");

    useEffect(() => {
        const checkAuth = () => {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            
            if (!token || !userData) {
                // Not authenticated, redirect to login without parameters
                router.push('/signin');
                return;
            }

            try {
                // Verify user data is valid JSON
                JSON.parse(userData);
                setIsAuthenticated(true);
            } catch (error) {
                // Invalid user data, clear and redirect
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/signin');
                return;
            }

            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, don't render dashboard
    if (!isAuthenticated) {
        return null;
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-hidden bg-[#f5f8fa]">
                {/* Sidebar */}
                <AppSidebar />

                {/* Main Content */}
                <SidebarInset className="flex flex-col w-full overflow-x-hidden">
                    {/* Header */}
                    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 md:h-16">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />

                        {/* Breadcrumb */}
                        <Breadcrumb>
                            <BreadcrumbList className="flex items-center space-x-1">
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>

                                {paths.map((segment, index) => {
                                    const href = `/dashboard/${paths.slice(0, index + 1).join("/")}`;
                                    const isLast = index === paths.length - 1;
                                    const label = segment.charAt(0).toUpperCase() + segment.slice(1);

                                    return (
                                        <div key={href} className="flex items-center">
                                            <BreadcrumbSeparator className="hidden md:block" />
                                            <BreadcrumbItem>
                                                {isLast ? (
                                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                        </div>
                                    );
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-auto p-4">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
