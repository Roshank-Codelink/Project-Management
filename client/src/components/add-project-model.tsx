'use client';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ChevronDownIcon } from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleaddallTeamleaderbyManager, handleadduserbyManager, hanndleCreateTask } from '@/ultis/Projectfetching/project';
import { ProjectTypeScript, SingupTypeScipt } from '../app/signup/types';
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

export default function DialogCloseButton() {
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            setImages(Array.from(selectedFiles));
        }
    };

    const [value, setValue] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [deadlineDate, setDeadlineDate] = useState<Date | undefined>();
    const [openStart, setOpenStart] = useState(false);
    const [openDeadline, setOpenDeadline] = useState(false);

    const [ProjectTaskdetails, setProjectTaskdetails] = useState<ProjectTypeScript>({
        Title: "",
        Description: "",
        StartDate: "",
        Deadline: "",
        Status: "",
        createdBy: "",
        assignedTo: [],
        acceptedBy: [],
        Priority: "",
        Attachments: [],
    });

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    const handlsubmitaddbymanager = (id: string) => {
        // Make sure id is not already in the array
        if (!ProjectTaskdetails.assignedTo.includes(id)) {
            setProjectTaskdetails({
                ...ProjectTaskdetails,
                assignedTo: [...ProjectTaskdetails.assignedTo, id], // no quotes around id
            });
        }
    };

    const handlesubmite = async () => {
        try {
            // Validation
            if (!ProjectTaskdetails.Title.trim()) {
                alert("Project title is required");
                return;
            }

            if (!value.trim()) {
                alert("Project description is required");
                return;
            }

            if (!ProjectTaskdetails.Priority) {
                alert("Priority is required");
                return;
            }

            if (!startDate || !deadlineDate) {
                alert("Start date and deadline are required");
                return;
            }

            if (ProjectTaskdetails.assignedTo.length === 0) {
                alert("Please assign at least one team member");
                return;
            }

            if (startDate >= deadlineDate) {
                alert("Deadline must be after start date");
                return;
            }

            // Update ProjectTaskdetails with the current description from ReactQuill
            const updatedProjectDetails = {
                ...ProjectTaskdetails,
                Description: value
            };

            console.log("Submitting project:", {
                ...updatedProjectDetails,
                startDate,
                deadlineDate,
                imagesCount: images.length
            });

            const data = await hanndleCreateTask(updatedProjectDetails, startDate as Date, deadlineDate as Date, images);
            console.log("Response:", data);

            if (data?.status === 201 || data?.status === 200) {
                alert("Project created successfully!");
                handlecancle();
            } else if (data?.response?.data?.errors) {
                // Handle validation errors
                const errorMessages = data.response.data.errors.map((err: any) => `${err.field}: ${err.message}`).join('\n');
                alert("Validation errors:\n" + errorMessages);
            } else if (data?.response?.data?.message) {
                alert("Error: " + data.response.data.message);
            } else {
                console.error("Error response:", data);
                alert("Failed to create project. Please try again.");
            }

        } catch (error: any) {
            console.error("Error creating project:", error);
            alert("Error creating project: " + (error.response?.data?.message || error.message || "Unknown error"));
        }
    }

    const [searchValue, setSearchValue] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [userdata, setUserdata] = useState<SingupTypeScipt[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await handleaddallTeamleaderbyManager(searchValue, departmentFilter);
            setUserdata(res?.data || []);
        };
        fetchUsers();
    }, [searchValue, departmentFilter])

    const handlecancle = () => {
        setProjectTaskdetails({
            Title: "",
            Description: "",
            StartDate: "",
            Deadline: "",
            Status: "",
            createdBy: "",
            assignedTo: [],
            acceptedBy: [],
            Priority: "",
            Attachments: [],
        });
        setValue(""); // Reset ReactQuill value
        setDeadlineDate(undefined);
        setStartDate(undefined);
        setImages([]); // Reset images
    }

    // Only show add project button for Managers
    if (user?.Role !== "Manager") {
        return null;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center justify-center bg-[#47548e] hover:bg-[#5e6ab4] text-white px-4 h-[36px] rounded text-sm w-full sm:w-auto whitespace-nowrap"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Project
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-5xl max-h-[90vh] p-6 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#303e67]">Create New Project</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        Please provide a name for your project and assign the relevant team members.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Section */}
                    <div className="space-y-6 pr-3 pb-2">
                        <div>
                            <Label htmlFor="title" className='pb-3'>Project Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="title"
                                value={ProjectTaskdetails.Title}
                                onChange={(e) => setProjectTaskdetails({ ...ProjectTaskdetails, Title: e.target.value })}
                                placeholder="Enter project name"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" className='pb-3'>Project Description</Label>
                            <div className="h-[250px] overflow-hidden border border-gray-300 rounded">
                                <ReactQuill
                                    theme="snow"
                                    value={value}
                                    onChange={(val) => {
                                        setValue(val);
                                        setProjectTaskdetails({ ...ProjectTaskdetails, Description: val });
                                    }}
                                    className="h-[210px]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            {/* Start Date */}
                            <div className="w-full md:w-1/2">
                                <Label htmlFor="StartDate" className='pb-3'>Start Date</Label>
                                <Popover open={openStart} onOpenChange={setOpenStart}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" id="StartDate" className="w-full justify-between font-normal">
                                            {startDate ? startDate.toLocaleDateString() : "Select start date"}
                                            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) => {
                                                setStartDate(date);
                                                setProjectTaskdetails({
                                                    ...ProjectTaskdetails,
                                                    StartDate: date ? date.toISOString() : "",
                                                });
                                                setOpenStart(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Deadline Date */}
                            <div className="w-full md:w-1/2">
                                <Label htmlFor="Deadline" className='pb-3'>Deadline</Label>
                                <Popover open={openDeadline} onOpenChange={setOpenDeadline}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" id="Deadline" className="w-full justify-between font-normal">
                                            {deadlineDate ? deadlineDate.toLocaleDateString() : "Select deadline"}
                                            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={deadlineDate}
                                            onSelect={(date) => {
                                                setDeadlineDate(date);
                                                setProjectTaskdetails({
                                                    ...ProjectTaskdetails,
                                                    Deadline: date ? date.toISOString() : "",
                                                });
                                                setOpenDeadline(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2">
                            <Label className='pb-3'>Priority <span className="text-red-500">*</span></Label>
                            <Select
                                onValueChange={(value) => setProjectTaskdetails({ ...ProjectTaskdetails, Priority: value })}
                                value={ProjectTaskdetails.Priority || undefined}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="space-y-6">
                        <div>
                            <p className="font-semibold text-lg text-[#303e67]">Team</p>
                            <Input
                                type="text"
                                placeholder="Search employee..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="mt-2 text-sm"
                            />

                            <div className="space-y-4 mt-4">
                                {userdata.slice(0, 3).map((name, index) => (
                                    <div key={index} className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-[#303e67]">{name.Username}</p>
                                            <p className="text-sm text-gray-500">{name.Role}</p>
                                        </div>
                                        <button className="text-gray-500 hover:text-[#47548e]" onClick={() => handlsubmitaddbymanager(name._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label className='pb-3'>Upload Project Images</Label>
                            <Button onClick={handleUploadClick} variant="outline" className="w-full mt-1">
                                Choose Files
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="mt-4 border border-dashed border-gray-300 rounded-md min-h-[200px] p-4 text-center text-gray-500">
                                {images.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                                        </svg>
                                        <p>Upload project images</p>
                                        <p className="text-xs">Min 600×600, PNG or JPEG, multiple files allowed</p>
                                    </div>
                                ) : (
                                    <ul className="space-y-2 text-sm text-left text-gray-700">
                                        {images.map((file, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <span className="truncate">{file.name}</span>
                                                <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="pt-6">
                    <Button className="bg-[#47548e] text-white hover:bg-[#5e6ab4]" onClick={handlesubmite}>
                        Create
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={handlecancle}>
                            Cancel
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
