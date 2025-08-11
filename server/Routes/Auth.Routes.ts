import { upload } from "../Config/Multer";
import { Authcontroller } from "../Controller/Auth.Controller";
import { Auth } from "../Middleware/Auth";
import { Manager, Employee, TeamLeader } from "../Middleware/checkProfileUpdatePermission";

let express = require("express");

export let Authroutes = express.Router();

Authroutes.post("/signup", Authcontroller.Signup);
Authroutes.post("/verifyotp", Authcontroller.VerifyOTP);
Authroutes.post("/signin", Authcontroller.Signin);
Authroutes.post("/forgetpasswordemailverify", Authcontroller.ForgetPasswordEmailVerify);
Authroutes.post("/forgetverifyotp", Authcontroller.ForgetVerifyOTP);
Authroutes.post("/resetpassword", Authcontroller.ResetPassword);
Authroutes.patch("/update-profile/:id", Auth, Manager, upload.single("ProfileImageUrl"), Authcontroller.UpdateProfile);
Authroutes.patch("/update-Profileteamleader/:id", Auth, TeamLeader, upload.single("ProfileImageUrl"), Authcontroller.UpdateProfileteamleader);
Authroutes.patch("/update-Profileemployee/:id", Auth, Employee, upload.single("ProfileImageUrl"), Authcontroller.UpdateProfileemployee);
Authroutes.get("/logout", Auth, Authcontroller.Logout);
Authroutes.get("/get-profile/:id", Auth, Authcontroller.GetProfile);

// Add Employee or codinater by manager
Authroutes.post("/add-teamleader/:id", Auth, Manager, Authcontroller.AddTeamLeader);
Authroutes.get("/get-teamleader", Auth, Manager, Authcontroller.GetTeamLeader);
Authroutes.post("/add-employee/:id", Auth, TeamLeader, Authcontroller.Addemployee);
Authroutes.get("/get-employee", Auth, TeamLeader, Authcontroller.Getemployee);
Authroutes.get("/get-all-employees", Auth, Manager, Authcontroller.GetAllEmployees);
Authroutes.get("/get-all-users", Auth,  Authcontroller.GetAllUsers);
Authroutes.get("/get-available-employees", Auth, TeamLeader, Authcontroller.GetAvailableEmployees);

// ✅ Add route for TeamLeader to get their assigned employees
Authroutes.get("/get-teamleader-employees/:teamLeaderId", Auth, TeamLeader, Authcontroller.GetTeamLeaderAssignedEmployees);






