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
import { UserPlus, Search, Filter, Users, Loader2, Eye, Mail, Building, User, Badge } from "lucide-react";
import { handleadduserbyManager, handleAlluser, handleadduserbyTeamLeader } from "@/ultis/Projectfetching/project";
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
import { Badge as BadgeComponent } from "@/components/ui/badge";

export default function DepartmentPage() {
    const [userdata, setUserdata] = useState<SingupTypeScipt[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, [searchValue, departmentFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            
            const apiDepartmentFilter = departmentFilter === "all" ? "" : departmentFilter;
            const response = await handleAlluser(searchValue, apiDepartmentFilter);
            setUserdata(Array.isArray(response) ? response : []);
            
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (userId: string) => {
        try {
            setLoading(true);
            let response;
            
            if (user?.Role === "Manager") {
                response = await handleadduserbyManager(userId);
                if (response && 'status' in response && response.status === 200) {
                    toast.success("Team leader added successfully");
                } else {
                    toast.error("Failed to add team leader");
                }
            } else if (user?.Role === "TeamLeader") {
                response = await handleadduserbyTeamLeader(userId);
                if (response && 'status' in response && response.status === 200) {
                    toast.success("Employee added to team successfully");
                } else {
                    toast.error("Failed to add employee to team");
                }
            }
            
            await fetchUsers();
        } catch (error) {
            console.error("Error adding user:", error);
            toast.error("Failed to add user");
        } finally {
            setLoading(false);
        }
    };

    const canAddUser = (targetUser: SingupTypeScipt) => {
        if (user?.Role === "Manager") {
            return targetUser.Role === "TeamLeader" && !targetUser.ReportingTo;
        } else if (user?.Role === "TeamLeader") {
            return targetUser.Role === "Employee" && !targetUser.ReportingTo;
        }
        return false;
    };

    const getAddButtonText = () => {
        if (user?.Role === "Manager") return "Add as Team Leader";
        if (user?.Role === "TeamLeader") return "Add to Team";
        return "Add";
    };

    const getPageTitle = () => {
        if (user?.Role === "Manager") return "Department Management";
        if (user?.Role === "TeamLeader") return "Team Management";
        return "Department Management";
    };

    const getPageDescription = () => {
        if (user?.Role === "Manager") return "Manage team leaders and department members";
        if (user?.Role === "TeamLeader") return "Add employees to your team";
        return "Department Management";
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "Manager":
                return "default";
            case "TeamLeader":
                return "secondary";
            case "Employee":
                return "outline";
            default:
                return "outline";
        }
    };

    const getDepartmentBadgeVariant = (department: string) => {
        switch (department) {
            case "IT":
                return "default";
            case "HR":
                return "secondary";
            case "Finance":
                return "destructive";
            case "Marketing":
                return "outline";
            default:
                return "outline";
        }
    };

    if (user?.Role === "Employee") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {getPageTitle()}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {getPageDescription()}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{userdata.length} users</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Filters */}
                <Card className="shadow-sm mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search users by name, email, or employee ID..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="w-full sm:w-48">
                                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Departments" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        <SelectItem value="IT">IT</SelectItem>
                                        <SelectItem value="HR">HR</SelectItem>
                                        <SelectItem value="Finance">Finance</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <Card className="shadow-sm">
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                                        <p className="text-gray-600">Loading users...</p>
                                    </div>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-16">Profile</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Employee ID</TableHead>
                                            <TableHead className="w-32">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {userdata.length > 0 ? (
                                            userdata.map((userItem) => (
                                                <TableRow key={userItem._id} className="hover:bg-gray-50">
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <Image
                                                                src={
                                                                    userItem.ProfileImageUrl?.startsWith("http")
                                                                        ? userItem.ProfileImageUrl
                                                                        : userItem.ProfileImageUrl
                                                                            ? `http://localhost:8080/User/${userItem.ProfileImageUrl.replace(/^\/+/, "")}`
                                                                            : "/logo-sm.png"
                                                                }
                                                                alt={userItem.Username}
                                                                width={40}
                                                                height={40}
                                                                className="rounded-full object-cover"
                                                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                                    const target = e.currentTarget;
                                                                    target.src = "/logo-sm.png";
                                                                }}
                                                                unoptimized
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{userItem.Username}</p>
                                                            <p className="text-sm text-gray-500">{userItem.EmployeeId}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm">{userItem.Email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <BadgeComponent variant={getRoleBadgeVariant(userItem.Role)}>
                                                            {userItem.Role}
                                                        </BadgeComponent>
                                                    </TableCell>
                                                    <TableCell>
                                                        <BadgeComponent variant={getDepartmentBadgeVariant(userItem.Department)}>
                                                            {userItem.Department}
                                                        </BadgeComponent>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-gray-600">{userItem.EmployeeId}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {canAddUser(userItem) && (
                                                            <Button
                                                                onClick={() => handleAddUser(userItem._id)}
                                                                disabled={loading}
                                                                size="sm"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <UserPlus className="w-4 h-4" />
                                                                {getAddButtonText()}
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12">
                                                    <div className="text-center">
                                                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                                                        <p className="text-gray-600">
                                                            {searchValue || departmentFilter !== "all" 
                                                                ? "Try adjusting your search or filters." 
                                                                : "No users available yet."}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                                <p className="text-gray-600">Loading users...</p>
                            </div>
                        </div>
                    ) : userdata.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {userdata.map((userItem) => (
                                <Card key={userItem._id} className="shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Image
                                                src={
                                                    userItem.ProfileImageUrl?.startsWith("http")
                                                        ? userItem.ProfileImageUrl
                                                        : userItem.ProfileImageUrl
                                                            ? `http://localhost:8080/User/${userItem.ProfileImageUrl.replace(/^\/+/, "")}`
                                                            : "/logo-sm.png"
                                                }
                                                alt={userItem.Username}
                                                width={48}
                                                height={48}
                                                className="rounded-full object-cover flex-shrink-0"
                                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                    const target = e.currentTarget;
                                                    target.src = "/logo-sm.png";
                                                }}
                                                unoptimized
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-gray-900 truncate">{userItem.Username}</h3>
                                                        <p className="text-sm text-gray-500">{userItem.EmployeeId}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <BadgeComponent variant={getRoleBadgeVariant(userItem.Role)} className="text-xs">
                                                            {userItem.Role}
                                                        </BadgeComponent>
                                                        <BadgeComponent variant={getDepartmentBadgeVariant(userItem.Department)} className="text-xs">
                                                            {userItem.Department}
                                                        </BadgeComponent>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail className="w-4 h-4" />
                                                        <span className="truncate">{userItem.Email}</span>
                                                    </div>
                                                    
                                                    {canAddUser(userItem) && (
                                                        <Button
                                                            onClick={() => handleAddUser(userItem._id)}
                                                            disabled={loading}
                                                            size="sm"
                                                            className="w-full flex items-center justify-center gap-2"
                                                        >
                                                            <UserPlus className="w-4 h-4" />
                                                            {getAddButtonText()}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="shadow-sm">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                                    <p className="text-gray-600">
                                        {searchValue || departmentFilter !== "all" 
                                            ? "Try adjusting your search or filters." 
                                            : "No users available yet."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Stats Summary */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{userdata.length}</p>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Managers</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {userdata.filter(u => u.Role === "Manager").length}
                                    </p>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Team Leaders</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {userdata.filter(u => u.Role === "TeamLeader").length}
                                    </p>
                                </div>
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Badge className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Employees</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {userdata.filter(u => u.Role === "Employee").length}
                                    </p>
                                </div>
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <User className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

