"use client";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil, Trash, Plus } from "lucide-react";
import { handleAlluser, handleadduserbyManager, handleaddallTeamleaderbyManager, getTeamLeaderAssignedEmployees } from "@/ultis/Projectfetching/project";
import { SingupTypeScipt } from "@/app/signup/types";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Team() {
    const { user } = useAuth();
    const [searchValue, setSearchValue] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [userdata, setUserdata] = useState<SingupTypeScipt[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [searchValue, departmentFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            let response;
            
            // Convert "all" to empty string for API
            const apiDepartmentFilter = departmentFilter === "all" ? "" : departmentFilter;
            
            if (user?.Role === "Manager") {
                // Manager can see all team leaders
                response = await handleaddallTeamleaderbyManager(searchValue, apiDepartmentFilter);
                console.log("📊 Manager team response:", response);
                setUserdata(response?.data || []);
            } else if (user?.Role === "TeamLeader") {
                // TeamLeader can see their assigned employees
                response = await getTeamLeaderAssignedEmployees(user._id, searchValue, apiDepartmentFilter);
                console.log("📊 TeamLeader employees response:", response);
                setUserdata(Array.isArray(response) ? response : []);
            } else {
                // Employee can only view
                setUserdata([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const getPageTitle = () => {
        if (user?.Role === "Manager") return "My Team Leaders";
        if (user?.Role === "TeamLeader") return "My Team Members";
        return "Team";
    };

    const getPageDescription = () => {
        if (user?.Role === "Manager") return "Manage your team leaders here.";
        if (user?.Role === "TeamLeader") return "Manage your team members here.";
        return "Team Management";
    };

    if (user?.Role === "Employee") {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">You don't have permission to access this page.</p>
            </div>
        );
    }

    return (
        <div>
            <Card className="w-full shadow-md">
                <CardHeader>
                    <div className="flex flex-col sm:flex-col sm:justify-between sm:items-center gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-semibold text-gray-800">
                                {getPageTitle()}
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                                {getPageDescription()}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="w-full sm:w-64"
                            />

                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="w-full sm:w-48 h-10 px-3 bg-white rounded-md border">
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    <SelectItem value="HR">HR</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="Operations">Operations</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0 overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <Table className="min-w-full text-sm">
                            <TableHeader className="bg-slate-100">
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Employee ID</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {userdata.length > 0 ? (
                                    userdata.map((user, index) => (
                                        <TableRow key={index} className="hover:bg-gray-50">
                                            <TableCell>
                                                <Image
                                                    src={
                                                        user.ProfileImageUrl?.startsWith("http")
                                                            ? user.ProfileImageUrl
                                                            : `http://localhost:8080/User/${user.ProfileImageUrl?.replace(/^\/+/, "")}`
                                                    }
                                                    alt={user.Username}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "/logo-sm.png";
                                                    }}
                                                    unoptimized
                                                />
                                            </TableCell>
                                            <TableCell>{user.Username}</TableCell>
                                            <TableCell>{user.Email}</TableCell>
                                            <TableCell className="capitalize">{user.Role}</TableCell>
                                            <TableCell>{user.Department}</TableCell>
                                            <TableCell>{user.EmployeeId}</TableCell>
                                            <TableCell>{user.Phone}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${user.IsActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {user.IsActive ? "Active" : "Inactive"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center gap-2 flex-wrap">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="hover:bg-blue-50"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4 text-blue-600" />
                                                    </Button>

                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-6 text-gray-400">
                                            {loading ? "Loading..." : "No users found."}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}