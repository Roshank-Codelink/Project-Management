"use client";

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    LogOut,
    Sparkles,
} from "lucide-react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import { SingupTypeScipt } from "../app/signup/types";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export function NavUser({ user }: { user: SingupTypeScipt | null }) {
    const { isMobile } = useSidebar();
    const { logout } = useAuth();

    const imageUrl =
        user?.ProfileImageUrl?.startsWith("http")
            ? user.ProfileImageUrl
            : `http://localhost:8080/User/${user?.ProfileImageUrl?.replace(/^\/+/, "")}`;

    const username = user?.Username || "User";
    const email = user?.Email || "No Email";

    const handleLogout = () => {
        logout();
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:text-sidebar-accent-foreground bg-[#1e293b]"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={imageUrl} alt={username} />
                                <AvatarFallback className="rounded-lg">
                                    {username[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium text-slate-100">{username}</span>
                                <span className="truncate text-xs text-slate-400">{email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={imageUrl} alt={username} />
                                    <AvatarFallback className="rounded-lg">
                                        {username[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{username}</span>
                                    <span className="truncate text-xs">{email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                           
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell className="mr-2 h-4 w-4" />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
