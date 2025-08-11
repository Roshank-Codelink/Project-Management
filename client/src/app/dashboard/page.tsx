"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { 
    Calendar, 
    Clock, 
    Users, 
    Target, 
    TrendingUp, 
    AlertCircle, 
    CheckCircle, 
    Play, 
    Pause,
    User,
    Building,
    FileText,
    Star,
    Award,
    Activity,
    Plus,
    Eye
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getallprojects, getTeamLeaderProjects, getEmployeeProjects } from "@/ultis/Projectfetching/project";
import { toast } from "sonner";
import Link from "next/link";

interface ProjectTask {
    _id: string;
    Title: string;
    Description: string;
    StartDate: string;
    Deadline: string;
    Status: "Pending" | "Accepted" | "In Progress" | "Completed";
    createdBy: any;
    assignedTo: any[];
    acceptedBy?: any[];
    Priority: "Low" | "Medium" | "High";
    Attachments?: string[];
    createdAt: string;
    updatedAt: string;
}

export default function Dashboard() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<ProjectTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [pendingTasks, setPendingTasks] = useState<ProjectTask[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                let response;
                
                if (user?.Role === "Manager") {
                    response = await getallprojects();
                } else if (user?.Role === "TeamLeader") {
                    response = await getTeamLeaderProjects(user._id);
                } else if (user?.Role === "Employee") {
                    response = await getEmployeeProjects(user._id);
                }
                
                const projectData = response?.data || [];
                setProjects(projectData);
                
                // Filter pending tasks
                const pending = projectData.filter((project: ProjectTask) => 
                    project.Status === "Pending" || project.Status === "Accepted"
                );
                setPendingTasks(pending);
                
            } catch (error) {
                console.error("Error fetching projects:", error);
                toast.error("Failed to fetch projects");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProjects();
        }
    }, [user]);

    // Calculate statistics
    const stats = {
        total: projects.length,
        pending: projects.filter(p => p.Status === "Pending").length,
        inProgress: projects.filter(p => p.Status === "In Progress").length,
        completed: projects.filter(p => p.Status === "Completed").length,
        highPriority: projects.filter(p => p.Priority === "High").length,
        teamMembers: projects.reduce((acc, p) => acc + (p.assignedTo?.length || 0), 0)
    };

    // Chart data
    const statusData = [
        { name: "Pending", value: stats.pending, color: "#fbbf24" },
        { name: "In Progress", value: stats.inProgress, color: "#f97316" },
        { name: "Completed", value: stats.completed, color: "#22c55e" }
    ];

    const priorityData = [
        { name: "High", value: stats.highPriority, color: "#ef4444" },
        { name: "Medium", value: projects.filter(p => p.Priority === "Medium").length, color: "#f59e0b" },
        { name: "Low", value: projects.filter(p => p.Priority === "Low").length, color: "#10b981" }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Pending": return <Clock className="w-4 h-4 text-yellow-500" />;
            case "Accepted": return <CheckCircle className="w-4 h-4 text-blue-500" />;
            case "In Progress": return <Play className="w-4 h-4 text-orange-500" />;
            case "Completed": return <Award className="w-4 h-4 text-green-500" />;
            default: return <Activity className="w-4 h-4 text-gray-500" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High": return "bg-red-100 text-red-800 border-red-200";
            case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Low": return "bg-green-100 text-green-800 border-green-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
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
                                Welcome back, {user?.Username}! 👋
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Here's what's happening with your projects today
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
                                <User className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">{user?.Role}</span>
                            </div>
                            {user?.Role === "Manager" && (
                                <Button asChild>
                                    <Link href="/dashboard/allproject">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View All Projects
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Total Projects
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.total}</div>
                            <p className="text-blue-100 text-sm">Active projects</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                In Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.inProgress}</div>
                            <p className="text-orange-100 text-sm">Currently working</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Completed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.completed}</div>
                            <p className="text-green-100 text-sm">Finished projects</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Team Members
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.teamMembers}</div>
                            <p className="text-purple-100 text-sm">Active team</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart className="w-5 h-5" />
                                Project Status Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                Priority Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={priorityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Tasks Section */}
                {pendingTasks.length > 0 && (
                    <Card className="shadow-lg border-l-4 border-l-orange-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-700">
                                <AlertCircle className="w-6 h-6" />
                                Pending Tasks ({pendingTasks.length})
                            </CardTitle>
                            <CardDescription>
                                Tasks that require your attention
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {pendingTasks.slice(0, 6).map((task) => (
                                    <div key={task._id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(task.Status)}
                                                <span className="text-sm font-medium text-gray-900">
                                                    {task.Title}
                                                </span>
                                            </div>
                                            <Badge className={getPriorityColor(task.Priority)}>
                                                {task.Priority}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {task.Description}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Due: {new Date(task.Deadline).toLocaleDateString()}</span>
                                            <span>{task.assignedTo?.length || 0} members</span>
                                        </div>
                                        <div className="mt-3">
                                            <Progress 
                                                value={task.Status === "Completed" ? 100 : 
                                                       task.Status === "In Progress" ? 60 : 
                                                       task.Status === "Accepted" ? 30 : 0} 
                                                className="h-2" 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {pendingTasks.length > 6 && (
                                <div className="mt-4 text-center">
                                    <Button variant="outline" asChild>
                                        <Link href="/dashboard/allproject">
                                            View All Tasks
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <div className="mt-8">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Button asChild className="h-auto p-4 flex flex-col items-center gap-2">
                                    <Link href="/dashboard/allproject">
                                        <Target className="w-6 h-6" />
                                        <span>View Projects</span>
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                                    <Link href="/dashboard/team">
                                        <Users className="w-6 h-6" />
                                        <span>Manage Team</span>
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                                    <Link href="/dashboard/department">
                                        <Building className="w-6 h-6" />
                                        <span>Departments</span>
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                                    <Link href="/dashboard/userproflie">
                                        <User className="w-6 h-6" />
                                        <span>Profile</span>
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
