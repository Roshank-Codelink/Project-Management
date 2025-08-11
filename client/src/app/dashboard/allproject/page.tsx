"use client";

import moment from "moment";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    MoreVertical,
    UserPlus,
    CheckCircle,
    Clock,
    Loader2,
    CircleDashed,
    Eye,
    Search,
    CheckSquare,
    Filter,
    Plus,
    Calendar,
    Users,
    Flag,
    TrendingUp,
    BarChart3
} from "lucide-react";
import DialogCloseButton from "@/components/add-project-model";
import { useEffect, useState } from "react";
import { getallprojects, getTeamLeaderProjects, getEmployeeProjects, getTeamLeaderTeamEmployees, assignTaskToEmployee, acceptTask, completeTask } from "@/ultis/Projectfetching/project";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SingupTypeScipt } from "@/app/signup/types";
import { Badge } from "@/components/ui/badge";

export interface IProjectTask {
    _id: string;
    Title: string;
    Description: string;
    StartDate: string;
    Deadline: string;
    Status: "Pending" | "Accepted" | "In Progress" | "Completed";
    createdBy: string;
    assignedTo: string[];
    acceptedBy?: string[];
    Priority: "Low" | "Medium" | "High";
    Attachments?: string[];
    createdAt: string;
    updatedAt: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<IProjectTask[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [teamEmployees, setTeamEmployees] = useState<SingupTypeScipt[]>([]);
    const [selectedProject, setSelectedProject] = useState<IProjectTask | null>(null);
    const [assignLoading, setAssignLoading] = useState(false);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const { user } = useAuth();

    // Status counts
    const [statusCounts, setStatusCounts] = useState({
        Pending: 0,
        Accepted: 0,
        "In Progress": 0,
        Completed: 0,
        Total: 0
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                let response;

                if (user?.Role === "Manager") {
                    response = await getallprojects();
                    setProjects(response.data || []);
                } else if (user?.Role === "TeamLeader") {
                    response = await getTeamLeaderProjects(user._id);
                    setProjects(response.data || []);
                } else if (user?.Role === "Employee") {
                    response = await getEmployeeProjects(user._id);
                    setProjects(response.data || []);
                } else {
                    setProjects([]);
                }

            } catch (error) {
                console.error("Error fetching projects:", error);
                toast.error("Failed to fetch projects");
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProjects();
        }
    }, [user]);

    // Calculate status counts when projects change
    useEffect(() => {
        const counts = {
            Pending: 0,
            Accepted: 0,
            "In Progress": 0,
            Completed: 0,
            Total: projects.length
        };

        projects.forEach(project => {
            if (counts.hasOwnProperty(project.Status)) {
                counts[project.Status as keyof typeof counts]++;
            }
        });

        setStatusCounts(counts);
    }, [projects]);

    // Fetch team employees when popup opens
    const fetchTeamEmployees = async () => {
        try {
            const response = await getTeamLeaderTeamEmployees(user?._id || "");
            setTeamEmployees(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error("Error fetching team employees:", error);
            setTeamEmployees([]);
        }
    };

    const handleAssignTask = async (employeeId: string) => {
        if (!selectedProject) return;

        try {
            setAssignLoading(true);
            const response = await assignTaskToEmployee(selectedProject._id, employeeId);

            if (response.message) {
                toast.success("Task assigned successfully!");
                setAssignDialogOpen(false);
                // Refresh projects
                const fetchProjects = async () => {
                    try {
                        setLoading(true);
                        let response;

                        if (user?.Role === "Manager") {
                            response = await getallprojects();
                            setProjects(response.data || []);
                        } else if (user?.Role === "TeamLeader") {
                            response = await getTeamLeaderProjects(user._id);
                            setProjects(response.data || []);
                        } else if (user?.Role === "Employee") {
                            response = await getEmployeeProjects(user._id);
                            setProjects(response.data || []);
                        }
                    } catch (error) {
                        console.error("Error refreshing projects:", error);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchProjects();
            }
        } catch (error) {
            console.error("Error assigning task:", error);
            toast.error("Failed to assign task");
        } finally {
            setAssignLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId: string, newStatus: string) => {
        try {
            setStatusUpdateLoading(taskId);

            let response;
            if (newStatus === "Accepted") {
                response = await acceptTask(taskId);
            } else {
                response = await completeTask(taskId, newStatus);
            }

            if (response.message) {
                toast.success("Status updated successfully!");
                // Refresh projects
                const fetchProjects = async () => {
                    try {
                        setLoading(true);
                        let response;

                        if (user?.Role === "Manager") {
                            response = await getallprojects();
                            setProjects(response.data || []);
                        } else if (user?.Role === "TeamLeader") {
                            response = await getTeamLeaderProjects(user._id);
                            setProjects(response.data || []);
                        } else if (user?.Role === "Employee") {
                            response = await getEmployeeProjects(user._id);
                            setProjects(response.data || []);
                        }
                    } catch (error) {
                        console.error("Error refreshing projects:", error);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchProjects();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } finally {
            setStatusUpdateLoading(null);
        }
    };

    const getAvailableStatuses = (currentStatus: string, userRole: string) => {
        if (userRole === "Employee") {
            switch (currentStatus) {
                case "Pending":
                    return ["Accepted"];
                case "Accepted":
                    return ["In Progress", "Completed"];
                case "In Progress":
                    return ["Completed"];
                default:
                    return [];
            }
        } else if (userRole === "TeamLeader") {
            switch (currentStatus) {
                case "Pending":
                    return ["Accepted"];
                case "Accepted":
                    return ["In Progress", "Completed"];
                case "In Progress":
                    return ["Completed"];
                default:
                    return [];
            }
        } else if (userRole === "Manager") {
            return ["Pending", "Accepted", "In Progress", "Completed"];
        }
        return [];
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Pending":
                return <Clock className="w-4 h-4" />;
            case "Accepted":
                return <CheckCircle className="w-4 h-4" />;
            case "In Progress":
                return <Loader2 className="w-4 h-4" />;
            case "Completed":
                return <CheckSquare className="w-4 h-4" />;
            default:
                return <CircleDashed className="w-4 h-4" />;
        }
    };

    const getPageTitle = () => {
        switch (user?.Role) {
            case "Manager":
                return "All Projects";
            case "TeamLeader":
                return "My Team Projects";
            case "Employee":
                return "My Assigned Projects";
            default:
                return "Projects";
        }
    };

    const getPageDescription = () => {
        switch (user?.Role) {
            case "Manager":
                return "Manage and track all your projects";
            case "TeamLeader":
                return "View and manage your team's projects";
            case "Employee":
                return "View your assigned projects and tasks";
            default:
                return "Project management";
        }
    };

    // Function to strip HTML tags from text
    const stripHtmlTags = (html: string) => {
        if (!html) return "";
        return html.replace(/<[^>]*>/g, '');
    };

    // Filter projects based on search and status
    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.Description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || project.Status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {getPageTitle()}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {getPageDescription()}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {user?.Role === "Manager" && (
                                <DialogCloseButton />
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{statusCounts.Total}</p>
                                <p className="text-sm text-blue-100">Total</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{statusCounts.Pending}</p>
                                <p className="text-sm text-yellow-100">Pending</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{statusCounts.Accepted}</p>
                                <p className="text-sm text-blue-100">Accepted</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{statusCounts["In Progress"]}</p>
                                <p className="text-sm text-orange-100">In Progress</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{statusCounts.Completed}</p>
                                <p className="text-sm text-green-100">Completed</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="w-full sm:w-48">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Accepted">Accepted</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Card key={project._id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {project.Title}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-gray-600 line-clamp-3">
                                            {stripHtmlTags(project.Description)}
                                        </CardDescription>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/discription/${project._id}`}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            {(user?.Role === "Manager" || user?.Role === "TeamLeader") && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedProject(project);
                                                            setAssignDialogOpen(true);
                                                            fetchTeamEmployees();
                                                        }}
                                                    >
                                                        <UserPlus className="w-4 h-4 mr-2" />
                                                        Assign Task
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Status and Priority */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(project.Status)}
                                        <span className="text-sm font-medium">{project.Status}</span>
                                    </div>
                                    <Badge variant={project.Priority === "High" ? "destructive" : project.Priority === "Medium" ? "default" : "secondary"}>
                                        {project.Priority}
                                    </Badge>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <div>
                                            <p className="text-gray-500">Start</p>
                                            <p className="font-medium">{moment(project.StartDate).format('MMM DD')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Flag className="w-4 h-4 text-red-500" />
                                        <div>
                                            <p className="text-gray-500">Deadline</p>
                                            <p className="font-medium">{moment(project.Deadline).format('MMM DD')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Members */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-500">
                                            {project.assignedTo?.length || 0} members
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {project.assignedTo?.slice(0, 3).map((member: any, index: number) => (
                                            <div key={index} className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                                <span className="text-xs font-medium text-white">
                                                    {member?.Username?.charAt(0) || "U"}
                                                </span>
                                            </div>
                                        ))}
                                        {project.assignedTo?.length > 3 && (
                                            <span className="text-xs text-gray-500">+{project.assignedTo.length - 3}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 pt-2">
                                    <Button variant="outline" size="sm" asChild className="flex-1">
                                        <Link href={`/dashboard/discription/${project._id}`}>
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </Link>
                                    </Button>
                                    {getAvailableStatuses(project.Status, user?.Role || "").length > 0 && (
                                        <Select onValueChange={(value) => handleStatusUpdate(project._id, value)}>
                                            <SelectTrigger className="w-full sm:w-auto">
                                                <SelectValue placeholder="Update" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getAvailableStatuses(project.Status, user?.Role || "").map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <CircleDashed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || statusFilter !== "all" ? "Try adjusting your search or filters." : "No projects available yet."}
                        </p>
                        {user?.Role === "Manager" && (
                            <DialogCloseButton />
                        )}
                    </div>
                )}
            </div>

            {/* Assign Task Dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Assign Task to Employee</DialogTitle>
                        <DialogDescription>
                            Select an employee to assign this task to.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {teamEmployees.map((employee) => (
                            <div key={employee._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                        <span className="text-sm font-medium text-white">
                                            {employee.Username?.charAt(0) || "U"}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{employee.Username}</p>
                                        <p className="text-sm text-gray-500">{employee.Role}</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleAssignTask(employee._id)}
                                    disabled={assignLoading}
                                >
                                    {assignLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Assign"}
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
