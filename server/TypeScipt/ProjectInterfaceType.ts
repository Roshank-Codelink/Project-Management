import mongoose from "mongoose";

export interface ProjectTaskModelType {
    Title: string;
    Description: string;
    StartDate: Date;
    Deadline: Date;
    Status: string;
    createdBy: mongoose.Types.ObjectId;
    assignedTo: mongoose.Types.ObjectId;
    acceptedBy?: mongoose.Types.ObjectId;
    employeeAssigned?: mongoose.Types.ObjectId;
    Priority: string;
    Attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface AssignTaskBodyType {
    taskId: string;
    assignedTo: string;
}