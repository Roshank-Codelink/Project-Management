import mongoose, { Document } from "mongoose";

export interface ProjectTaskModelTyp extends Document {
  Title: string;
  Description: string;
  StartDate: Date;
  Deadline: Date;
  Status: "Pending" | "Accepted" | "In Progress" | "Completed";
  createdBy: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId[];
  acceptedBy?: mongoose.Types.ObjectId[];
  Priority: "Low" | "Medium" | "High";
  Attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectTaskSchema = new mongoose.Schema<ProjectTaskModelTyp>(
  {
    Title: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    StartDate: {
      type: Date,
      required: true,
    },
    Deadline: {
      type: Date,
      required: true,
    },
    Status: {
      type: String,
      enum: ["Pending", "Accepted", "In Progress", "Completed"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
    ],
    acceptedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: false,
      },
    ],
    Priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    Attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ProjectTaskModel = mongoose.model<ProjectTaskModelTyp>(
  "Project",
  ProjectTaskSchema
);

export default ProjectTaskModel;
