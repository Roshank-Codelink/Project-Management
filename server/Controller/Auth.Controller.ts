import UserModel, { UserModelType } from "../Model/Auth.Model";
import bcrypt from "bcryptjs";
import { generateEmployeeID } from "../utils/generateEmployeeID";
import { generateOTPandToken } from "../utils/generateOTPandToken";
import { SendMail } from "../utils/Mail";
import { SignupSchemaYub } from "../validation/Auth/SignupSchemaYup";
import { OtpSchemaYub } from "../validation/Auth/OTPSchemaYup";
import { SigninSchemaYub } from "../validation/Auth/SigninSchemaYup";
import { EmailSchemaYub } from "../validation/Auth/EmailSchemaYup";
import { ResetPasswordSchemaYup } from "../validation/Auth/ResetPasswordSchemaYup";
import { UpdateSchemaYup } from "../validation/Auth/UpdateSchemaYup";
import { Request, Response } from "express";
import { OTPTokenPayload, User } from "../TypeScipt/UserInterfaceType";
require("dotenv").config();
const ejs = require('ejs');
const jwt = require('jsonwebtoken');

interface authcontroller {
  Signup: (req: Request, res: Response) => Promise<Response>,
  VerifyOTP: (req: Request, res: Response) => Promise<Response>,
  Signin: (req: Request, res: Response) => Promise<Response>,
  ForgetPasswordEmailVerify: (req: Request, res: Response) => Promise<Response>,
  ForgetVerifyOTP: (req: Request, res: Response) => Promise<Response>,
  ResetPassword: (req: Request, res: Response) => Promise<Response>,
  AddTeamLeader: (req: Request, res: Response) => Promise<Response>,
  GetTeamLeader: (req: Request, res: Response) => Promise<Response>,
  Addemployee: (req: Request, res: Response) => Promise<Response>,
  Getemployee: (req: Request, res: Response) => Promise<Response>,
  GetAllEmployees: (req: Request, res: Response) => Promise<Response>,
  UpdateProfile: (req: Request, res: Response) => Promise<Response | undefined>,
  UpdateProfileteamleader: (req: Request, res: Response) => Promise<Response | undefined>,
  GetProfile: (req: Request, res: Response) => Promise<Response>,
  UpdateProfileemployee: (req: Request, res: Response) => Promise<Response | undefined>,
  Logout: (req: Request, res: Response) => Promise<Response>,
  GetAllUsers: (req: Request, res: Response) => Promise<Response>,
  GetAvailableEmployees: (req: Request, res: Response) => Promise<Response>,
  GetTeamLeaderAssignedEmployees: (req: Request, res: Response) => Promise<Response>,
}
export const Authcontroller: authcontroller = {
  Signup: async (req, res) => {
    try {
      const { Username, Email, Password, Phone, Role, Department } = req.body as User;
      await SignupSchemaYub.validate(req.body, { abortEarly: false });
      const isExistingUser: UserModelType | null = await UserModel.findOne({ Email });
      if (isExistingUser) {
        return res.status(409).json({
          message: "User Alredy Exists."
        })
      }

      let sendOTP = await generateOTPandToken({ ...req.body }, process.env.PRIVATE_KEY as string, "5m");

      let MainHTMlTemplate: string = await ejs.renderFile(__dirname + "/../views/Email.ejs", { OTP: sendOTP.OTP, username: Username });
      SendMail(Email, MainHTMlTemplate, "OTP Verification");
      return res.cookie("OTP_Verification_Token", sendOTP.token).status(200).json({
        message: "OTP Send You Email Address."
      })

    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors = error.inner.map((err: any) => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({ errors });
      }
      return res.status(500).json({
        message: "Something went wrong.",
        error: error.message || "Internal Server Error"
      });
    }
  },
  VerifyOTP: async (req, res) => {
    let { Otp } = req.body as { Otp: number };
    try {
      await OtpSchemaYub.validate(req.body, { abortEarly: false });
      let token = req.cookies.OTP_Verification_Token as string;
      let { Userdata, OTP } = await jwt.verify(token, process.env.PRIVATE_KEY as string) as { Userdata: UserModelType, OTP: number };
      if (Otp !== OTP) {
        return res.status(400).json({ message: "Invalid OTP." });
      }
      const EmployeeID = await generateEmployeeID();
      const hashPassword = await bcrypt.hash(Userdata.Password, 10);
      const userdata: UserModelType = await UserModel.create({ Username: Userdata.Username, Email: Userdata.Email, Password: hashPassword, Phone: Userdata.Phone, Role: Userdata.Role, Department: Userdata.Department, EmployeeId: EmployeeID });
      return res.status(201).json({
        userdata,
        message: "Registered Successfully."
      })
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors = error.inner.map((err: any) => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({ errors });
      }
      return res.status(500).json({
        message: "Something went wrong.",

        error: error.message || "Internal Server Error"
      });
    }
  },
  Signin: async (req, res) => {
    const { Email, Password } = req.body as User;

    try {

      await SigninSchemaYub.validate(req.body, { abortEarly: false });
      const Userdata = await UserModel.findOne({ Email }) as UserModelType;

      if (!Userdata) {
        return res.status(400).json({
          message: "No account found with this email address. Please check the email or sign up."
        })
      }

      let ValidPassword = await bcrypt.compare(Password, Userdata.Password,);
      if (!ValidPassword) {
        return res.status(400).json({
          message: "Invalid Password."
        })
      }
      Userdata.IsActive = true;
      await Userdata.save();

      const token: string = await jwt.sign({ Userdata }, process.env.PRIVATE_KEY, {
        expiresIn: "7d",
      });
      if (!token) {
        return res.status(400).json({
          message: "Something went wrong."
        })
      }
      const { Password: _, ...userWithoutPassword } = Userdata.toObject() as UserModelType;


      return res.cookie("Access_Token", token).status(200).json({
        message: "Login Successfull",
        Userdata: userWithoutPassword
      });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors = error.inner.map((err: any) => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({ errors });
      }

      return res.status(500).json({
        message: "Something went wrong.",
        error: error.message || "Internal Server Error"
      });
    }
  },
  ForgetPasswordEmailVerify: async (req, res) => {
    let { Email } = req.body as User;
    try {
      await EmailSchemaYub.validate(req.body, { abortEarly: false });
      let Emailfind = await UserModel.findOne({ Email }) as UserModelType;
      if (!Emailfind) {
        return res.status(400).json({
          message: "No account found with this email address. Please check the email or sign up."
        })
      }
      let sendOTP = await generateOTPandToken({ Emailfind }, process.env.PRIVATE_KEY as string, "5m");
      let MainHTMlTemplate = await ejs.renderFile(__dirname + "/../views/Email.ejs", { OTP: sendOTP.OTP, username: Emailfind.Username });
      await SendMail(Email, MainHTMlTemplate, "OTP Verification");
      return res.cookie("OTP_Verification_Token", sendOTP.token).status(200).json({
        message: "OTP Send You Email Address."
      })
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors = error.inner.map((err: any) => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({ errors });
      }
      return res.status(500).json({
        message: "Something went wrong.",
        error: error.message || "Internal Server Error"
      });
    }
  },
  ForgetVerifyOTP: async (req, res) => {
    let { Otp } = req.body as { Otp: number };
    try {
      await OtpSchemaYub.validate(req.body, { abortEarly: false });
      let token = req.cookies.OTP_Verification_Token as string;

      let { OTP } = await jwt.verify(token, process.env.PRIVATE_KEY) as { OTP: number };

      if (Otp !== OTP) {
        return res.status(400).json({ message: "Invalid OTP." });
      }
      return res.status(200).json({
        message: "OTP Verified. You can now reset your password."
      })
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors = error.inner.map((err: any) => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({ errors });
      }
      return res.status(500).json({
        message: "Something went wrong.",
        error: error.message || "Internal Server Error"
      });
    }
  },
  ResetPassword: async (req, res) => {
    const { Password } = req.body as User;

    try {
      const token = req.cookies.OTP_Verification_Token as String;

      if (!token) {
        return res.status(401).json({ message: "Token missing" });
      }

      const { Userdata } = jwt.verify(token, process.env.PRIVATE_KEY);
      const Email = Userdata.Emailfind.Email;
      const Username = Userdata.Emailfind.Username;
      const payloadToValidate = {
        Password,
        Email,
        Username
      } as User;
      await ResetPasswordSchemaYup.validate(payloadToValidate, { abortEarly: false });
      let hassPasword = await bcrypt.hash(Password, 10);
      await UserModel.updateOne({ Email: Userdata.Emailfind.Email }, { $set: { Password: hassPasword } });
      return res.status(200).json({ message: "Password reset successful" });

    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors = error.inner.map((err: any) => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({ errors });
      }

      return res.status(500).json({
        message: "Something went wrong.",
        error: error.message || "Internal Server Error"
      });
    }
  },
  AddTeamLeader: async (req, res) => {

    try {
      let AdministratorId = req.User._id;
      let currentUserRole = req.User.Role;

      // Only Administrator can assign coordinator
      if (currentUserRole !== "Manager") {
        return res.status(403).json({
          message: "Access denied. Only administrators can assign coordinators.",
        });
      }

      const { id } = req.params;

      const coordinator = await UserModel.findOne({ _id: id, Role: "TeamLeader" });

      if (!coordinator) {
        return res.status(404).json({ message: "Team Leader not found." });
      }

      if (coordinator.ReportingTo) {
        return res.status(400).json({
          message: "This Team Leader is already assigned to someone.",
        });
      }

      coordinator.ReportingTo = AdministratorId;
      await coordinator.save();

      return res.status(200).json({ message: "Team Leader assigned successfully." });

    } catch (error: any) {
      return res.status(500).json({
        message: "Something went wrong.",
        error: error.message || "Internal Server Error"
      });
    }
  },
  GetTeamLeader: async (req, res) => {
    try {
      const currentUserId = req.User._id;

      // Query params
      const role = req.query.role || "";
      const department = req.query.department || "";
      const isActive = req.query.isActive || "";
      const search = req.query.search || "";

      // Base filter: Logged-in user ke under wale hi aayenge
      const filter = {
        ReportingTo: currentUserId,
      } as any;

      if (role) {
        filter.Role = role;
      }

      if (department) {
        filter.Department = department;
      }

      if (isActive !== "") {
        filter.IsActive = isActive === "true"; // boolean convert
      }

      if (search) {
        filter.$or = [
          { Username: { $regex: search, $options: "i" } },
          { Email: { $regex: search, $options: "i" } },
          { EmployeeId: { $regex: search, $options: "i" } },
        ];
      }

      const data = await UserModel.find(filter).select("-Password");

      return res.status(200).json({
        message: "Users under you fetched successfully",
        data,
      });

    } catch (error: any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
  Addemployee: async (req, res) => {
    try {
      let AssociatorId = req.User._id;
      let currentUserRole = req.User.Role;
      if (currentUserRole !== "TeamLeader") {
        return res.status(403).json({
          message: "Access denied. Only Team Leaders can assign employees.",
        });
      }

      const { id } = req.params;

      const associate = await UserModel.findOne({ _id: id, Role: "Employee" });

      if (!associate) {
        return res.status(404).json({ message: "Employee not found." });
      }

      if (associate.ReportingTo) {
        return res.status(400).json({
          message: "This employee is already assigned to someone.",
        });
      }

      associate.ReportingTo = AssociatorId;
      await associate.save();

      return res.status(200).json({ message: "Employee assigned successfully." });

    } catch (error: any) {
      return res.status(500).json({
        message: "Something went wrong.",
        error: error.message || "Internal Server Error"
      });
    }
  },

  Getemployee: async (req, res) => {
    try {
      let currentUserId = req.User._id;
      let role = req.query.role || "";
      let department = req.query.department || "";
      let isActive = req.query.isActive || "";
      let search = req.query.search || "";
      let filter: any = {
        ReportingTo: currentUserId,
      };
      if (role) {
        filter.Role = role;
      }
      if (department) {
        filter.Department = department;
      }
      if (isActive !== "") {
        filter.IsActive = isActive === "true";
      }
      if (search) {
        filter.$or = [
          { Username: { $regex: search, $options: "i" } },
          { Email: { $regex: search, $options: "i" } },
          { EmployeeId: { $regex: search, $options: "i" } },
        ];
      }
      const data = await UserModel.find(filter).select("-Password");
      return res.status(200).json({
        message: "User fetched successfully",
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
  GetAvailableEmployees: async (req, res) => {
    try {
      let role = req.query.role || "";
      let department = req.query.department || "";
      let isActive = req.query.isActive || "";
      let search = req.query.search || "";
      
      // Find employees that are not assigned to anyone (no ReportingTo)
      let filter: any = {
        Role: "Employee",
        ReportingTo: { $exists: false } // Employees not assigned to anyone
      };
      
      if (department) {
        filter.Department = department;
      }
      if (isActive !== "") {
        filter.IsActive = isActive === "true";
      }
      if (search) {
        filter.$or = [
          { Username: { $regex: search, $options: "i" } },
          { Email: { $regex: search, $options: "i" } },
          { EmployeeId: { $regex: search, $options: "i" } },
        ];
      }
      
      const data = await UserModel.find(filter).select("-Password");
      return res.status(200).json({
        message: "Available employees fetched successfully",
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
  GetAllEmployees: async (req, res) => {
    try {
      const currentUserId = req.User._id;
      const role = req.query.role || "";
      const department = req.query.department || "";
      const isActive = req.query.isActive || "";
      const search = req.query.search || "";

      let coordinatorFilter: any = {
        ReportingTo: currentUserId,
        Role: "TeamLeader",
      };

      if (department) coordinatorFilter.Department = department;
      if (isActive !== "") coordinatorFilter.IsActive = isActive === "true";
      if (search) {
        coordinatorFilter.$or = [
          { Username: { $regex: search, $options: "i" } },
          { Email: { $regex: search, $options: "i" } },
          { EmployeeId: { $regex: search, $options: "i" } },
        ];
      }

      const coordinators = await UserModel.find(coordinatorFilter).select("-Password");
      const coordinatorIds = coordinators.map((c) => c._id);

      let associateFilter: any = {
        ReportingTo: { $in: coordinatorIds },
        Role: "TeamLeader",
      };
      if (department) associateFilter.Department = department;
      if (isActive !== "") associateFilter.IsActive = isActive === "true";
      if (search) {
        associateFilter.$or = [
          { Username: { $regex: search, $options: "i" } },
          { Email: { $regex: search, $options: "i" } },
          { EmployeeId: { $regex: search, $options: "i" } },
        ];
      }
      const associates = await UserModel.find(associateFilter).select("-Password");
      let combined = [...coordinators, ...associates];
      if (role === "TeamLeader") combined = coordinators;
      else if (role === "Employee") combined = associates;

      return res.status(200).json({
        message: "Fetched employees with filters",
        coordinatorCount: coordinators.length,
        associateCount: associates.length,
        total: combined.length,
        data: combined,
      });

    } catch (error: any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
  UpdateProfile: async (req, res) => {
    try {
      let { id } = req.params;
      
      let { Username, Phone} = req.body as User;
      await UpdateSchemaYup.validate(req.body, { abortEarly: false });
      if (!req.file) {
        let Updateprofile = await UserModel.findByIdAndUpdate(id, { $set: { Username, Phone} as User }, { new: true });
        console.log(Updateprofile)
        if (!Updateprofile) {
          return res.status(404).json({ message: "User Not Found." })
        }
        return res.status(200).json({ message: "Profile Updated Successfully.", data: Updateprofile })
      }
      if (req.file) {
        // ✅ Fix: Use req.file.filename instead of req.file.originalname
        let Updateprofile = await UserModel.findByIdAndUpdate(id, { $set: { Username, Phone, ProfileImageUrl: req.file.filename } }, { new: true });
        if (!Updateprofile) {
          return res.status(400).json({
            message: "Error While updateing Profile!"
          })
        }
        return res.status(200).json({
          message: "Profile Update Successfully.",
          data: Updateprofile
        })
      }
    } catch (error: any) {
      return res.status(500).json({ message: "Something went wrong.", error: error.message })
    }
  },
  UpdateProfileteamleader: async (req, res) => {
    let { id } = req.params;
    if (id !== req.User._id as any) {
      return res.status(403).json({ message: "You don't have permission." })
    }
    try {
      let { Username, Phone } = req.body as User;
      await UpdateSchemaYup.validate(req.body, { abortEarly: false });
      if (!req.file) {
        let Updateprofile = await UserModel.findByIdAndUpdate(id, { $set: { Username, Phone } as User }, { new: true });
        if (!Updateprofile) {
          return res.status(404).json({ message: "User Not Found." })
        }
        return res.status(200).json({ message: "Profile Updated Successfully.", data: Updateprofile })
      }
      if (req.file) {
        // ✅ Fix: Use req.file.filename instead of req.file.originalname
        let Updateprofile = await UserModel.findByIdAndUpdate(id, { $set: { Username, Phone, ProfileImageUrl: req.file.filename } }, { new: true });
        if (!Updateprofile) {
          return res.status(400).json({
            message: "Error While updating Profile!"
          })
        }
        return res.status(200).json({
          message: "Profile Update Successfully.",
          data: Updateprofile  // ✅ Added this line to return updated data
        })
      }

    } catch (error: any) {
      return res.status(500).json({ message: "Something went wrong.", error: error.message })
    }
  },
  UpdateProfileemployee: async (req, res) => {
    let { id } = req.params;
    if (id !== req.User._id as any) {
      return res.status(403).json({ message: "You don't have permission." })
    }
    try {
      let { Username, Phone } = req.body as User;
      await UpdateSchemaYup.validate(req.body, { abortEarly: false });
      if (!req.file) {
        let Updateprofile = await UserModel.findByIdAndUpdate(id, { $set: { Username, Phone } as User }, { new: true });
        if (!Updateprofile) {
          return res.status(404).json({ message: "User Not Found." })
        }
        return res.status(200).json({ message: "Profile Updated Successfully.", data: Updateprofile })
      }
      if (req.file) {
        // ✅ Fix: Use req.file.filename instead of req.file.originalname
        let Updateprofile = await UserModel.findByIdAndUpdate(id, { $set: { Username, Phone, ProfileImageUrl: req.file.filename } }, { new: true });
        if (!Updateprofile) {
          return res.status(400).json({
            message: "Error While updating Profile!"
          })
        }
        return res.status(200).json({
          message: "Profile Update Successfully.",
          data: Updateprofile  // ✅ Added this line to return updated data
        })
      }

    } catch (error: any) {
      return res.status(500).json({ message: "Something went wrong.", error: error.message })
    }
  },
  GetProfile: async (req, res) => {
    try {
      let { id } = req.params;
      if (id !== req.User._id as any) {
        return res.status(403).json({ message: "You don't have permission." })
      }
      let profile = await UserModel.findById(id).select("-Password");
      if (!profile) {
        return res.status(404).json({ message: "User Not Found." })
      }
      return res.status(200).json({ message: "Profile Fetched Successfully.", data: profile })
    } catch (error: any) {
      return res.status(500).json({ message: "Something went wrong.", error: error.message })
    }
  },
  GetAllUsers: async (req, res) => {
    try {
      const { search, role, department } = req.query;

      let query: any = {};

      // Search conditions (Username, Email, EmployeeId)
      if (search) {
        query.$or = [
          { Username: { $regex: search, $options: "i" } },
          { Email: { $regex: search, $options: "i" } },
          { EmployeeId: { $regex: search, $options: "i" } },
        ];
      }

      // Filter by Role
      if (role) {
        query.Role = role;
      }

      // Filter by Department
      if (department) {
        query.Department = department;
      }

      const users = await UserModel.find(query).select("-Password");

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found." });
      }

      return res
        .status(200)
        .json({ message: "Users fetched successfully.", data: users });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Something went wrong.", error: error.message });
    }
  },

  Logout: async (req, res) => {
    try {
      const token = req.cookies.Access_Token as string;

      if (!token) {
        return res.status(400).json({ message: "User already logged out." });
      }

      const decoded = jwt.verify(token, process.env.PRIVATE_KEY) as OTPTokenPayload;
      const userId = decoded.Userdata._id;

      // User ko inactive kar do
      await UserModel.findByIdAndUpdate(userId, { IsActive: false });

      // Cookie clear karo
      return res.clearCookie("Access_Token").status(200).json({
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Logout failed.",
        error: error.message,
      });
    }
  },

  GetTeamLeaderAssignedEmployees: async (req, res) => {
    try {
      const { teamLeaderId } = req.params;
      const { search, department } = req.query;
      const AuthId = req.User._id;

      // Check if the requesting user is the team leader
      if (AuthId.toString() !== teamLeaderId) {
        return res.status(403).json({ message: "You can only view your own team employees." });
      }

      // Build query for employees who report to this team leader
      const query: any = { 
        ReportingTo: teamLeaderId,
        Role: "Employee"
      };

      // Add search filter
      if (search) {
        query.$or = [
          { Username: { $regex: search, $options: 'i' } },
          { Email: { $regex: search, $options: 'i' } }
        ];
      }

      // Add department filter
      if (department) {
        query.Department = department;
      }

      // Find employees who report to this team leader
      const employees = await UserModel.find(query).select('Username Email Role Department ProfileImageUrl Phone');

      return res.status(200).json({
        message: "Team employees fetched successfully",
        data: employees
      });

    } catch (error: any) {
      console.error("Error fetching team leader employees:", error);
      return res.status(500).json({
        message: "Something went wrong.",
        error: error.message || "Internal Server Error",
      });
    }
  }

}








