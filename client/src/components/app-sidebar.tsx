"use client";

import * as React from "react";
import {
    SquareTerminal,
    FolderKanban,
    Users,
    Building2,
    UserCheck,
} from "lucide-react";

import { NavMain } from "./nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { SingupTypeScipt } from "../app/signup/types";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [userData, setUserData] = React.useState<SingupTypeScipt | null>(null);

    React.useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            const parsedData = JSON.parse(data) as SingupTypeScipt;
            setUserData(parsedData);
        }
    }, []);

    // Different sidebar items based on user role
    const getSidebarItems = () => {
        if (userData?.Role === "TeamLeader") {
            return [
                {
                    name: "Home",
                    url: "/dashboard",
                    icon: SquareTerminal,
                },
                {
                    name: "My Projects",
                    url: "/dashboard/allproject",
                    icon: FolderKanban,
                },
                {
                    name: "My Team",
                    url: "/dashboard/team",
                    icon: Users,
                },
                {
                    name: "Department",
                    url: "/dashboard/department",
                    icon: Building2,
                },
                {
                    name: "My Profile",
                    url: "/dashboard/userproflie",
                    icon: UserCheck,
                },
            ];
        } else if (userData?.Role === "Manager") {
            return [
                {
                    name: "Home",
                    url: "/dashboard",
                    icon: SquareTerminal,
                },
                {
                    name: "Projects",
                    url: "/dashboard/allproject",
                    icon: FolderKanban,
                },
                {
                    name: "My Team",
                    url: "/dashboard/team",
                    icon: Users,
                },
                {
                    name: "Department",
                    url: "/dashboard/department",
                    icon: Building2,
                },
                {
                    name: "My Profile",
                    url: "/dashboard/userproflie",
                    icon: UserCheck,
                },
            ];
        } else {
            // Employee sidebar
            return [
                {
                    name: "Home",
                    url: "/dashboard",
                    icon: SquareTerminal,
                },
                {
                    name: "My Projects",
                    url: "/dashboard/allproject",
                    icon: FolderKanban,
                },
                {
                    name: "My Profile",
                    url: "/dashboard/userproflie",
                    icon: UserCheck,
                },
            ];
        }
    };

    const sidebarItems = getSidebarItems();

    return (
        <Sidebar collapsible="icon" {...props} className="bg-[#0f172a] text-white">
            <SidebarHeader>
                <div className="flex justify-center mb-4">
                    <Image
                        src="/logo-sm.png"
                        width={40}
                        height={40}
                        alt="logo"
                        className="rounded-full object-contain"
                    />
                </div>

                <div className="flex items-center gap-3 text-white bg-[#1e293b]  py-1 rounded-lg shadow-md max-w-sm overflow-hidden">
                    <div className="relative w-8 h-8 shrink-0">
                        {userData?.ProfileImageUrl && (
                            <Image
                                src={
                                    userData.ProfileImageUrl.startsWith("http")
                                        ? userData.ProfileImageUrl
                                        : `http://localhost:8080/User/${userData.ProfileImageUrl.replace(/^\/+/, "")}`
                                }
                                alt="User"
                                width={30}
                                height={30}
                                className="rounded-full object-cover w-8 h-8"
                            />
                        )}
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-500" />
                    </div>
                    <div className="min-w-0 overflow-hidden">
                        <p className="text-sm font-semibold text-slate-100 truncate">
                            {userData?.Username}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                            {userData?.Role} • {userData?.Department}
                        </p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={sidebarItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
