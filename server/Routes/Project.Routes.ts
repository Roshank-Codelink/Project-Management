import { Router } from "express";
import { upload } from "../Config/Multer";
import { ProjectController } from "../Controller/Project.Controller";
import { Auth } from "../Middleware/Auth";
import { Employee, Manager, TeamLeader, } from "../Middleware/checkProfileUpdatePermission";

let express = require("express");

export let ProjectRoutes: Router = express.Router();

ProjectRoutes.post("/create-project", Auth, Manager, upload.array('Attachments', 5), ProjectController.Cretetask);
ProjectRoutes.get("/get-all-projects", Auth, Manager, ProjectController.GetAllProjectsbyManager);
ProjectRoutes.get("/get-all-projects/:id", Auth, TeamLeader, ProjectController.GetAllProjectsbyTeamLeader);
ProjectRoutes.get("/get-project/:id", Auth, ProjectController.GetProjectById);
ProjectRoutes.post("/assign-task-teamleader", Auth, TeamLeader, ProjectController.AssignTaskbyTeamLeader);
ProjectRoutes.get("/get-all-projects-employee/:id", Auth, Employee, ProjectController.GetAllProjectsbyEmployee);
ProjectRoutes.post("/accept-task", Auth, Employee, ProjectController.AcceptTask);
ProjectRoutes.post("/task-completion", Auth, Employee, ProjectController.TaskCompletion);
ProjectRoutes.get("/all-tasks", Auth, TeamLeader, ProjectController.byTeamLeader);

// ✅ New route for project update (Manager only)
ProjectRoutes.put("/update-project/:id", Auth, Manager, upload.array('Attachments', 5), ProjectController.UpdateProject);





