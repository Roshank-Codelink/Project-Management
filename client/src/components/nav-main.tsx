"use client";

import { LucideIcon } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";

export function NavMain({
    items,
}: {
    items: {
        name: string;
        url: string;
        icon?: LucideIcon;
    }[];
}) {
    const pathname = usePathname();

    const normalize = (path: string) => path.replace(/\/+$/, "");

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                Main Menu
            </SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => {
                    const currentPath = normalize(pathname);
                    const itemPath = normalize(item.url);
                    const isActive = currentPath === itemPath;

                    return (
                        <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton asChild tooltip={item.name}>
                                <Link
                                    href={item.url}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-5 rounded-md text-[16px] font-medium transition-all",
                                        isActive
                                            ? "bg-slate-700 text-white"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    )}
                                >
                                    {item.icon && <item.icon className="w-6 h-6" />}
                                    <span>{item.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
