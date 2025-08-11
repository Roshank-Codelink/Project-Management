import mongoose, { Schema, Document, Types } from "mongoose";

export interface UserModelType extends Document {
  Username: string;
  Email: string;
  Password: string;
  Phone: number;
  Role: "Manager" | "TeamLeader" | "Employee";
  Department: string;
  EmployeeId: string;
  IsActive: boolean;
  ProfileImageUrl: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  ReportingTo?: Types.ObjectId | null; // Reference to another User
}

const UserSchema = new Schema<UserModelType>(
  {
    Username: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Phone: { type: Number, required: true, unique: true },
    Role: {
      type: String,
      enum: ["Manager", "TeamLeader", "Employee"],
      required: true,
    },
    Department: { type: String, required: true },
    EmployeeId: { type: String, unique: true },
    IsActive: { type: Boolean, default: false },
    ProfileImageUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/4205/4205906.png",
    },
    ReportingTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<UserModelType>("Users", UserSchema);

export default UserModel;
