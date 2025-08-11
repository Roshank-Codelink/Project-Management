"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import {
    Calendar,
    Clock,
    User,
    FileText,
    AlertTriangle,
    CheckCircle,
    Play,
    Pause,
    Download,
    ArrowLeft,
    Users,
    Target,
    Flag,
    CheckSquare,
    BarChart3,
    X,
    Eye
} from "lucide-react";
import Link from "next/link";
import { Descriptionpagefetch } from "@/ultis/Projectfetching/project";

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
    createdAt?: string;
    updatedAt?: string;
}

export default function ProjectDescriptionPage() {
    const { id } = useParams();
    const [project, setProject] = useState<ProjectTask | null>(null);
    console.log();
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
  

    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            try {
                setLoading(true);
                const res = await Descriptionpagefetch(id as string)
                if (res && res.data) {
                    setProject(res.data);
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Accepted":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "In Progress":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "Completed":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-800 border-red-200";
            case "Medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Low":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Pending":
                return <Clock className="w-4 h-4" />;
            case "Accepted":
                return <CheckCircle className="w-4 h-4" />;
            case "In Progress":
                return <Play className="w-4 h-4" />;
            case "Completed":
                return <CheckSquare className="w-4 h-4" />;
            default:
                return <AlertTriangle className="w-4 h-4" />;
        }
    };

    const getProgressValue = (status: string) => {
        switch (status) {
            case "Pending":
                return 25;
            case "Accepted":
                return 50;
            case "In Progress":
                return 75;
            case "Completed":
                return 100;
            default:
                return 0;
        }
    };

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
                    <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
                    <Button asChild>
                        <Link href="/dashboard/allproject">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Projects
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Add a function to strip HTML tags
    const stripHtmlTags = (html: string) => {
        if (!html) return "";
        return html.replace(/<[^>]*>/g, '');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard/allproject">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                                    {project.Title}
                                </h1>
                                <p className="text-sm text-gray-500">Project Details</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className={`${getStatusColor(project.Status)} border`}>
                                {getStatusIcon(project.Status)}
                                <span className="ml-1">{project.Status}</span>
                            </Badge>
                            <Badge className={`${getPriorityColor(project.Priority)} border`}>
                                <Flag className="w-3 h-3 mr-1" />
                                {project.Priority}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Project Overview */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Project Overview Card */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Project Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700"
                                    >
                                        {stripHtmlTags(project.Description)}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">Progress</span>
                                        <span className="text-sm text-gray-500">{getProgressValue(project.Status)}%</span>
                                    </div>
                                    <Progress value={getProgressValue(project.Status)} className="h-2" />
                                </div>

                                {/* Key Information Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Start Date</p>
                                            <p className="text-sm text-gray-600">
                                                {format(new Date(project.StartDate), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Clock className="w-5 h-5 text-red-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Deadline</p>
                                            <p className="text-sm text-gray-600">
                                                {format(new Date(project.Deadline), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attachments Card */}
                        {project.Attachments && project.Attachments.length > 0 && (
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Attachments ({project.Attachments.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {project.Attachments.map((attachment, index) => {
                                            // Check if it's an image file
                                            const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(attachment);
                                            const imageUrl = attachment.startsWith('http') 
                                                ? attachment 
                                                : `http://localhost:8080/Project/${attachment.replace(/^\/+/, '')}`;
                                            
                                            console.log(`Attachment ${index}:`, attachment);
                                            console.log(`Constructed URL:`, imageUrl);
                                            
                                            return (
                                                <div key={index} className="group relative">
                                                    {isImage ? (
                                                        <div
                                                            className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                                            onClick={() => openImageModal(imageUrl)}
                                                        >
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Attachment ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                                onLoad={() => console.log(`Image ${index} loaded successfully:`, imageUrl)}
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCAxMDBDNjAgODguOTU0MyA2OC45NTQzIDgwIDgwIDgwQzkxLjA0NTcgODAgMTAwIDg4Ljk1NDMgMTAwIDEwMEMxMDAgMTExLjA0NiA5MS4wNDU3IDEyMCA4MCAxMjBDNjguOTU0MyAxMjAgNjAgMTExLjA0NiA2MCAxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04MCAxNDBDNjguOTU0MyAxNDAgNjAgMTMxLjA0NiA2MCAxMjBDNjAgMTA4Ljk1NCA2OC45NTQzIDEwMCA4MCAxMDBDOTEuMDQ1NyAxMDAgMTAwIDEwOC45NTQgMTAwIDEyMEMxMDAgMTMxLjA0NiA5MS4wNDU3IDE0MCA4MCAxNDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNDAgMTAwQzE0MCA4OC45NTQzIDE0OC45NTQgODAgMTYwIDgwQzE3MS4wNDYgODAgMTgwIDg4Ljk1NDMgMTgwIDEwMEMxODAgMTExLjA0NiAxNzEuMDQ2IDEyMCAxNjAgMTIwQzE0OC45NTQgMTIwIDE0MCAxMTEuMDQ2IDE0MCAxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNjAgMTQwQzE0OC45NTQgMTQwIDE0MCAxMzEuMDQ2IDE0MCAxMjBDMTQwIDEwOC45NTQgMTQ4Ljk1NCAxMDAgMTYwIDEwMEMxNzEuMDQ2IDEwMCAxODAgMTA4Ljk1NCAxODAgMTIwQzE4MCAxMzEuMDQ2IDE3MS4wNDYgMTQwIDE2MCAxNDBaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <FileText className="w-12 h-12 text-gray-400" />
                                                            <span className="text-sm text-gray-500 ml-2">File</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Hover overlay with download button */}
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                                        <div className="flex gap-2">
                                                            {isImage && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="secondary"
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 hover:bg-gray-100"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openImageModal(imageUrl);
                                                                    }}
                                                                >
                                                                    <Eye className="w-4 h-4 mr-1" />
                                                                    View
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 hover:bg-gray-100"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // Handle download
                                                                    const link = document.createElement('a');
                                                                    link.href = imageUrl;
                                                                    link.download = `attachment-${index + 1}`;
                                                                    link.click();
                                                                }}
                                                            >
                                                                <Download className="w-4 h-4 mr-1" />
                                                                Download
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* File name */}
                                                    <div className="mt-2 text-center">
                                                        <p className="text-xs text-gray-600 truncate">
                                                            {attachment.split('/').pop() || `Attachment ${index + 1}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Project Creator & Team Card */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Project Creator & Team
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Project Creator */}
                                <div className="border-b border-gray-200 pb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Project Creator</h4>
                                    <div className="flex items-center gap-3">
                                        {project.createdBy?.ProfileImageUrl ? (
                                            <img
                                                src={`http://localhost:8080/User/${project?.createdBy?.ProfileImageUrl}`}
                                                alt="Creator"
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {project.createdBy?.Username || "Unknown User"}
                                            </p>
                                            <p className="text-sm text-gray-500">Manager</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Members */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Team Members</h4>
                                    {project.assignedTo && project.assignedTo.length > 0 ? (
                                        <div className="space-y-3">
                                            {project.assignedTo.map((member: any, index: number) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    {member.ProfileImageUrl ? (
                                                        <img
                                                            src={`http://localhost:8080/User/${member.ProfileImageUrl}`}
                                                            alt={member.Username}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                                            <User className="w-5 h-5 text-white" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                            {member.Username || "Unknown User"}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{member.Role || "Employee"}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {project.acceptedBy?.includes(member._id) ? (
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">No team members assigned yet</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Project Stats Card */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Project Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {project.assignedTo?.length || 0}
                                        </p>
                                        <p className="text-sm text-blue-600">Team Members</p>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">
                                            {project.Attachments?.length || 0}
                                        </p>
                                        <p className="text-sm text-green-600">Attachments</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-5xl max-h-full bg-white rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = selectedImage;
                                        link.download = 'project-attachment';
                                        link.click();
                                    }}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={closeImageModal}
                                    className="hover:bg-gray-200"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-4">
                      
                            <img
                                src={`http://localhost:8080/Project/${selectedImage}`}
                                alt="Project attachment"
                                className="max-w-full max-h-[70vh] object-contain rounded-lg mx-auto"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCAxMDBDNjAgODguOTU0MyA2OC45NTQzIDgwIDgwIDgwQzkxLjA0NTcgODAgMTAwIDg4Ljk1NDMgMTAwIDEwMEMxMDAgMTExLjA0NiA5MS4wNDU3IDEyMCA4MCAxMjBDNjguOTU0MyAxMjAgNjAgMTExLjA0NiA2MCAxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04MCAxNDBDNjguOTU0MyAxNDAgNjAgMTMxLjA0NiA2MCAxMjBDNjAgMTA4Ljk1NCA2OC45NTQzIDEwMCA4MCAxMDBDOTEuMDQ1NyAxMDAgMTAwIDEwOC45NTQgMTAwIDEyMEMxMDAgMTMxLjA0NiA5MS4wNDU3IDE0MCA4MCAxNDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNDAgMTAwQzE0MCA4OC45NTQzIDE0OC45NTQgODAgMTYwIDgwQzE3MS4wNDYgODAgMTgwIDg4Ljk1NDMgMTgwIDEwMEMxODAgMTExLjA0NiAxNzEuMDQ2IDEyMCAxNjAgMTIwQzE0OC45NTQgMTIwIDE0MCAxMTEuMDQ2IDE0MCAxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNjAgMTQwQzE0OC45NTQgMTQwIDE0MCAxMzEuMDQ2IDE0MCAxMjBDMTQwIDEwOC45NTQgMTQ4Ljk1NCAxMDAgMTYwIDEwMEMxNzEuMDQ2IDEwMCAxODAgMTA4Ljk1NCAxODAgMTIwQzE4MCAxMzEuMDQ2IDE3MS4wNDYgMTQwIDE2MCAxNDBaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
