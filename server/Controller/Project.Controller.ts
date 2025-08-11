import { ProjectTaskYup } from "../validation/ProjectTask/ProjectSchemaYup";
import ProjectTaskModel, { ProjectTaskModelTyp } from "../Model/ProjectTask.Model";
import { Request, Response } from "express";
import { AssignTaskBodyType, ProjectTaskModelType } from "../TypeScipt/ProjectInterfaceType";
import { Document } from "mongoose";
import mongoose from "mongoose";

// Extended interface for project update
interface UpdateProjectBodyType {
    Title?: string;
    Description?: string;
    StartDate?: string;
    Deadline?: string;
    assignedTo?: string | string[];
    Priority?: string;
    Status?: string;
}

interface ProjectController {
    Cretetask: (req: Request, res: Response) => Promise<Response | void>,
    GetAllProjectsbyManager: (req: Request, res: Response) => Promise<Response | void>
    GetAllProjectsbyTeamLeader: (req: Request, res: Response) => Promise<Response | void>
    AssignTaskbyTeamLeader: (req: Request, res: Response) => Promise<Response | void>
    AcceptTask: (req: Request, res: Response) => Promise<Response | void>
    GetAllProjectsbyEmployee: (req: Request, res: Response) => Promise<Response | void>
    TaskCompletion: (req: Request, res: Response) => Promise<Response | void>
    byTeamLeader: (req: Request, res: Response) => Promise<Response | void>
    GetProjectById: (req: Request, res: Response) => Promise<Response | void>
    UpdateProject: (req: Request, res: Response) => Promise<Response | void> // ✅ Added
}

interface TaskCompletionBodyType extends AssignTaskBodyType {
    newStatus?: string;
}


export const ProjectController: ProjectController = {
    Cretetask: async (req, res) => {
        let { Title, Description, StartDate, Deadline, assignedTo, Priority } = req.body;
        let AuthId = req.User._id;

        try {
            // Parse assignedTo if it's a string (from FormData)
            let parsedAssignedTo: string[] = [];
            if (assignedTo) {
                if (typeof assignedTo === 'string') {
                    parsedAssignedTo = assignedTo.split(',').filter((id: string) => id.trim() !== '');
                } else if (Array.isArray(assignedTo)) {
                    parsedAssignedTo = assignedTo;
                }
            }

            // Prepare data for validation
            const validationData = {
                Title,
                Description,
                StartDate: new Date(StartDate),
                Deadline: new Date(Deadline),
                assignedTo: parsedAssignedTo,
                Priority,
                Status: "Pending" // Default status
            };

            await ProjectTaskYup.validate(validationData, { abortEarly: false });

            let fileNames: string[] = [];

            if (req.files && Array.isArray(req.files)) {
                fileNames = (req.files as Express.Multer.File[]).map(
                    (file) => file.filename
                );
            }

            const createTask = await ProjectTaskModel.create({
                Title,
                Description,
                StartDate: new Date(StartDate),
                Deadline: new Date(Deadline),
                assignedTo: parsedAssignedTo,
                Priority,
                createdBy: AuthId,
                Attachments: fileNames,
            });

            return res
                .status(201)
                .json({ message: "Task Created Successfully.", data: createTask });
        } catch (error: any) {
            console.error("Project creation error:", error);
            
            if (error.name === "ValidationError") {
                const errors = error.inner.map((err: any) => ({
                    field: err.path,
                    message: err.message,
                }));
                return res.status(400).json({ 
                    message: "Validation failed",
                    errors 
                });
            }

            return res.status(500).json({
                message: "Something went wrong.",
                error: error.message || "Internal Server Error",
            });
        }
    },
    GetAllProjectsbyManager: async (req, res) => {
        try {

            const AuthId = req.User._id;


            const projects = await ProjectTaskModel.find({ createdBy: AuthId }).populate("createdBy");


            if (!projects || projects.length === 0) {
                return res.status(404).json({ message: "No Projects Found for this Manager." });
            }


            return res.status(200).json({
                message: "Projects Fetched Successfully.",
                length: projects.length,
                data: projects,

            });

        } catch (error: any) {

            return res.status(500).json({
                message: "Something went wrong.",
                error: error.message || "Internal Server Error",
            });
        }
    },
    GetAllProjectsbyTeamLeader: async (req, res) => {
        try {
            let { id } = req.params;
            const AuthId = req.User._id;
            if (id !== AuthId.toString()) {
                return res.status(403).json({ message: "You don't have permission." })
            }

            const projects = await ProjectTaskModel.find({ assignedTo: AuthId }).populate("createdBy");

            if (!projects || projects.length === 0) {
                return res.status(404).json({ message: "No projects assigned to this Team Leader." });
            }
            return res.status(200).json({
                message: "Projects fetched successfully.",
                data: projects,
                length: projects.length,
            });

        } catch (error: any) {
            return res.status(500).json({
                message: "Something went wrong.",
                error: error.message || "Internal Server Error",
            });
        }
    },
    AssignTaskbyTeamLeader: async (req, res) => {
        try {
            const { taskId, assignedTo } = req.body as AssignTaskBodyType;
            const acceptedBy = req.User._id;

            const task = await ProjectTaskModel.findById(taskId) as ProjectTaskModelTyp;
            if (!task) {
                return res.status(404).json({ message: "Task not found." });
            }
            if (task.assignedTo?.toString() === assignedTo.toString()) {
                return res.status(400).json({ message: "Task is already assigned to this employee." });
            }
            task.assignedTo = [new mongoose.Types.ObjectId(assignedTo)];
            task.acceptedBy = [new mongoose.Types.ObjectId(acceptedBy)];
            task.Status = "Accepted";

            await task.save();

            return res.status(200).json({ message: "Task assigned successfully and status updated to Accepted." });

        } catch (error: any) {
            return res.status(500).json({
                message: "Something went wrong.",
                error: error.message || "Internal Server Error",
            });
        }
    },
    AcceptTask: async (req, res) => {
        try {
            const { taskId } = req.body as AssignTaskBodyType;
            const AuthId = req.User._id;

            const task = await ProjectTaskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task not found." });
            }
            
            // Check if user is assigned to this task
            const isAssigned = task.assignedTo.some((id: any) => id.toString() === AuthId.toString());
            if (!isAssigned) {
                return res.status(403).json({ message: "You are not assigned to this task." });
            }

            // Only allow accepting if status is "Pending"
            if (task.Status === "Pending") {
                task.Status = "Accepted";
                await task.save();
                return res.status(200).json({
                    message: "Task accepted successfully.",
                    updatedTask: task
                });
            }

            return res.status(400).json({ message: "Task cannot be accepted. Current status: " + task.Status });

        } catch (error: any) {
            console.error("Error while accepting task:", error);
            return res.status(500).json({
                message: "Something went wrong.",
                error: error.message || "Internal Server Error",
            });
        }
    },
    GetAllProjectsbyEmployee: async (req, res) => {
        try {
            let { id } = req.params;
            console.log(" Requested Employee ID:", id);
            const AuthId = req.User._id;
            console.log("🔍 Auth ID:", AuthId);
            
            if (id !== AuthId.toString()) {
                console.log("❌ Permission denied - ID mismatch");
                return res.status(403).json({ message: "You don't have permission." })
            }

            // Get ALL projects assigned to this employee (all statuses)
            const projects: ProjectTaskModelTyp[] = await ProjectTaskModel.find({
                assignedTo: AuthId
            }).populate("createdBy");
            
            console.log("📊 Found projects count:", projects.length);
            console.log("📊 Projects:", projects.map(p => ({ id: p._id, title: p.Title, status: p.Status })));
            
            if (!projects || projects.length === 0) {
                console.log("❌ No projects found for employee");
                return res.status(404).json({ message: "No projects assigned to this Employee." });
            }
            
            console.log("✅ Returning projects successfully");
            return res.status(200).json({
                message: "Projects fetched successfully.",
                data: projects,
                length: projects.length,
            });

        } catch (error: any) {
            console.error("❌ Error in GetAllProjectsbyEmployee:", error);
            return res.status(500).json({
                message: "Something went wrong.",
                error: error.message || "Internal Server Error",
            });
        }
    },
    TaskCompletion: async (req, res) => {
        try {
            const { taskId, newStatus } = req.body as AssignTaskBodyType & { newStatus?: "Pending" | "Accepted" | "In Progress" | "Completed" };
            const AuthId = req.User._id;

            const task = await ProjectTaskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task not found." });
            }
            
            // Check if user is assigned to this task (assignedTo is an array)
            const isAssigned = task.assignedTo.some((id: any) => id.toString() === AuthId.toString());
            if (!isAssigned) {
                return res.status(403).json({ message: "You are not assigned to this task." });
            }

            // If newStatus is provided, use it; otherwise use default logic
            if (newStatus) {
                // Validate status transition
                const validTransitions: { [key: string]: string[] } = {
                    "Accepted": ["In Progress", "Completed"],
                    "In Progress": ["Completed"],
                    "Pending": ["Accepted"]
                };

                const currentStatus = task.Status;
                const allowedTransitions = validTransitions[currentStatus] || [];
                
                if (allowedTransitions.includes(newStatus)) {
                    task.Status = newStatus;
                    await task.save();
                    return res.status(200).json({ 
                        message: `Task status updated to ${newStatus} successfully.`,
                        updatedTask: task 
                    });
                } else {
                    return res.status(400).json({ 
                        message: `Invalid status transition from ${currentStatus} to ${newStatus}` 
                    });
                }
            } else {
                // Default logic: Accepted -> Completed
                if (task.Status === "Accepted") {
                    task.Status = "Completed";
                    await task.save();
                    return res.status(200).json({ message: "Task completed successfully." });
                }
                return res.status(400).json({ message: "Task cannot be completed. Current status: " + task.Status });
            }
        } catch (error: any) {
            return res.status(500).json({
                message: "Something went wrong.",
                error: error.message || "Internal Server Error",
            });
        }
    },
    byTeamLeader: async (req, res) => {
        try {
            const AuthId = req.User._id;
            const projects = await ProjectTaskModel.find(AuthId).populate("createdBy") as ProjectTaskModelTyp[];
            if (!projects) {
                return res.status(404).json({ message: "No projects assigned to this Employee." });
            }
            return res.status(200).json({
                message: "Projects fetched successfully.",
                data: projects,

            });
        } catch (error: any) {
            return res.status(500).json({
                message: "Something went wrong.",
                error: error.message || "Internal Server Error",
            });
        }
    },
    GetProjectById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const AuthId = req.User._id;

            const project = await ProjectTaskModel.findById(id)
                .populate("createdBy", "Username Email ProfileImageUrl")
                .populate("assignedTo", "Username Email ProfileImageUrl")
                .populate("acceptedBy", "Username Email ProfileImageUrl");

            if (!project) {
                return res.status(404).json({ message: "Project not found." });
            }

            // Check if user has permission to view this project
            const isCreator = project.createdBy._id.toString() === AuthId.toString();
            const isAssigned = project.assignedTo?.some((user: any) => user._id.toString() === AuthId.toString());
            const isAccepted = project.acceptedBy?.some((user: any) => user._id.toString() === AuthId.toString());

            if (!isCreator && !isAssigned && !isAccepted) {
                return res.status(403).json({ message: "You don't have permission to view this project." });
            }

            return res.status(200).json({
                message: "Project fetched successfully.",
                data: project,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: "Something went wrong.",
                error: error.message || "Internal Server Error",
            });
        }
    },
    UpdateProject: async (req, res) => {
        try {
            const { id } = req.params;
            const AuthId = req.User._id;
            const { Title, Description, StartDate, Deadline, assignedTo, Priority, Status } = req.body as UpdateProjectBodyType;

            // Find the project
            const project = await ProjectTaskModel.findById(id);
            if (!project) {
                return res.status(404).json({ message: "Project not found." });
            }

            // Check if the user is the creator of this project (Manager only)
            if (project.createdBy.toString() !== AuthId.toString()) {
                return res.status(403).json({ message: "You don't have permission to update this project." });
            }

            // Parse assignedTo if it's a string (from FormData)
            let parsedAssignedTo: string[] = [];
            if (assignedTo) {
                if (typeof assignedTo === 'string') {
                    parsedAssignedTo = assignedTo.split(',').filter((id: string) => id.trim() !== '');
                } else if (Array.isArray(assignedTo)) {
                    parsedAssignedTo = assignedTo;
                }
            }

            // Prepare update data
            const updateData: any = {};
            if (Title) updateData.Title = Title;
            if (Description) updateData.Description = Description;
            if (StartDate) updateData.StartDate = new Date(StartDate);
            if (Deadline) updateData.Deadline = new Date(Deadline);
            if (parsedAssignedTo.length > 0) updateData.assignedTo = parsedAssignedTo;
            if (Priority) updateData.Priority = Priority;
            if (Status) updateData.Status = Status;

            // Handle file attachments
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                const fileNames = (req.files as Express.Multer.File[]).map(
                    (file) => file.filename
                );
                updateData.Attachments = fileNames;
            }

            // Validate the update data if needed
            if (Object.keys(updateData).length > 0) {
                // You can add validation here if needed
                // await ProjectTaskYup.validate(updateData, { abortEarly: false });
            }

            // Update the project
            const updatedProject = await ProjectTaskModel.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true }
            ).populate("createdBy", "Username Email ProfileImageUrl")
             .populate("assignedTo", "Username Email ProfileImageUrl");

            if (!updatedProject) {
                return res.status(404).json({ message: "Failed to update project." });
            }

            return res.status(200).json({
                message: "Project updated successfully.",
                data: updatedProject
            });

        } catch (error: any) {
            console.error("Project update error:", error);
            
            if (error.name === "ValidationError") {
                const errors = error.inner.map((err: any) => ({
                    field: err.path,
                    message: err.message,
                }));
                return res.status(400).json({ 
                    message: "Validation failed",
                    errors 
                });
            }

            return res.status(500).json({
                message: "Something went wrong.",
                error: error.message || "Internal Server Error",
            });
        }
    },
    // Updat and Delete are Panding
}