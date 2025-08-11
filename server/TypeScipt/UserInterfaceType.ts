import { Types, Document } from "mongoose";

export interface User extends Document {
    _id: Types.ObjectId;
    Username: string;
    Email: string;
    Password: string;
    Phone: number;
    Role: string;
    Department: string;
    EmployeeId: string;
    IsActive: boolean;
    ProfileImageUrl: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    ReportingTo?: Types.ObjectId | null;
}

export interface OTPTokenPayload {
    Userdata: User;
    OTP: number;
    iat?: number;
    exp?: number;
}



