
import { ProjectTypeScript, SingupTypeScipt } from "@/app/signup/types";
import axios, { AxiosResponse } from "axios";
import { UserProfileType } from "@/app/dashboard/userproflie/page";

export const hanndleCreateTask = async (
    data: ProjectTypeScript,
    startDate: Date,
    deadlineDate: Date,
    files?: File[]
): Promise<AxiosResponse | any> => {
    console.log(data)
    try {
        const formData = new FormData();
        formData.append('Title', data.Title);
        formData.append('Description', data.Description);
        formData.append('StartDate', startDate.toISOString());
        formData.append('Deadline', deadlineDate.toISOString());
        formData.append('assignedTo', data.assignedTo.join(','));
        formData.append('Priority', data.Priority);

        // Append files if they exist
        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append('Attachments', file);
            });
        }

        const res: AxiosResponse = await axios.post(
            "http://localhost:8080/api/v1/projects/create-project",
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        return res;
    } catch (error: any) {
        return error;
    }
};

export const handleAlluser = async (serarchvalue: string, departmentFilter: string) => {
    try {
        const res = await axios.get(
            `http://localhost:8080/api/v1/authentication/get-all-users?search=${serarchvalue}&department=${departmentFilter}`,
            {
                withCredentials: true,
            }
        );
        return res.data.data;
    } catch (error: any) {
        console.log("❌ Error fetching all users:", error.response?.data || error.message);
        return [];
    }
};

export const handleadduserbyManager = async (userId: string) => {
    try {
        const res = await axios.post(
            `http://localhost:8080/api/v1/authentication/add-teamleader/${userId}`,
            {}, // Empty body
            {
                withCredentials: true,
            }
        );
        return res;
    } catch (error: any) {
        console.error("Error adding team leader by manager:", error);
        return error;
    }
};

// Function to get all team leaders for manager
export const handleaddallTeamleaderbyManager = async (searchValue: string, departmentFilter: string) => {
    try {
        console.log("🔍 Fetching team leaders with search:", searchValue, "department:", departmentFilter);
        
        const res = await axios.get(
            `http://localhost:8080/api/v1/authentication/get-teamleader?search=${searchValue}&department=${departmentFilter}`,
            {
                withCredentials: true,
            }
        );
        
        console.log("✅ Team leaders response:", res.data);
        return res.data; // Return the full response
    } catch (error: any) {
        console.error("❌ Error fetching team leaders:", error.response?.data || error.message);
        return { data: [] };
    }
};

export const getalltask = async () => {
    try {
        const res = await axios.get(
            "http://localhost:8080/api/v1/projects/get-all-projects",
            {
                withCredentials: true,
            }
        );
        return res.data;
    } catch (error: any) {
        console.log("❌ Error fetching all tasks:", error.response?.data || error.message);
        return [];
    }
};

export const getallprojects = async () => {
    try {
        const res = await axios.get(
            "http://localhost:8080/api/v1/projects/get-all-projects",
            {
                withCredentials: true,
            }
        );
        return res.data;
    } catch (error: any) {
        console.log("❌ Error fetching all projects:", error.response?.data || error.message);
        return [];
    }
};

export const updateuserprofile = async (
    formData: FormData,
    userId: string
): Promise<UserProfileType | null> => {
    try {
        const res = await axios.patch(
            `http://localhost:8080/api/v1/authentication/update-profile/${userId}`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        // ✅ Only return the user data, not the message
        return res.data.data;
    } catch (error: any) {
        console.log("❌ Error updating profile:", error.response?.data || error.message);
        return null;
    }
};

export const Descriptionpagefetch = async (projectId: string) => {
    try {
        const res = await axios.get(
            `http://localhost:8080/api/v1/projects/get-project/${projectId}`,
            {
                withCredentials: true,
            }
        );
        return res.data;
    } catch (error: any) {
        console.log("❌ Error fetching project description:", error.response?.data || error.message);
        return null;
    }
};

export const updateuserprofileT = async (
    formData: FormData,
    userId: string
): Promise<UserProfileType | null> => {
    try {
        const res = await axios.patch(
            `http://localhost:8080/api/v1/authentication/update-Profileteamleader/${userId}`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        // ✅ Only return the user data, not the message
        return res.data.data;
    } catch (error: any) {
        console.log("❌ Error updating team leader profile:", error.response?.data || error.message);
        return null;
    }
};

// Add this new function for team leaders to add employees
export const handleadduserbyTeamLeader = async (userId: string) => {
    try {
        const res = await axios.post(
            `http://localhost:8080/api/v1/authentication/add-employee/${userId}`,
            {}, // Empty body
            {
                withCredentials: true,
            }
        );
        return res;
    } catch (error: any) {
        console.error("Error adding employee by team leader:", error);
        return error;
    }
};

// Function for TeamLeader to get their assigned projects
export const getTeamLeaderProjects = async (teamLeaderId: string) => {
    try {
        const res: AxiosResponse = await axios.get(
            `http://localhost:8080/api/v1/projects/get-all-projects/${teamLeaderId}`,
            {
                withCredentials: true,
            }
        );
        return res.data;
    } catch (error: any) {
        console.error("Error fetching team leader projects:", error);
        return { data: [] };
    }
}

// Function for Employee to get their assigned projects
export const getEmployeeProjects = async (employeeId: string) => {
    try {
        console.log("🔍 Fetching employee projects for ID:", employeeId);
        
        const res: AxiosResponse = await axios.get(
            `http://localhost:8080/api/v1/projects/get-all-projects-employee/${employeeId}`,
            {
                withCredentials: true,
            }
        );
        
        console.log("📊 Employee projects response:", res.data);
        
        // Handle different response structures
        if (res.data && res.data.data) {
            return res.data;
        } else if (res.data && Array.isArray(res.data)) {
            return { data: res.data };
        } else {
            console.warn("Unexpected response structure:", res.data);
            return { data: [] };
        }
    } catch (error: any) {
        console.error("❌ Error fetching employee projects:", error);
        return { data: [] };
    }
}

// Function for TeamLeader to assign task to employee
export const assignTaskToEmployee = async (taskId: string, employeeId: string) => {
    try {
        const res = await axios.post(
            `http://localhost:8080/api/v1/projects/assign-task-teamleader`,
            {
                taskId,
                assignedTo: employeeId
            },
            {
                withCredentials: true,
            }
        );
        return res.data;
    } catch (error: any) {
        console.error("Error assigning task to employee:", error);
        return error;
    }
}

// Function for Employee to accept task
export const acceptTask = async (taskId: string) => {
    try {
        const res: AxiosResponse = await axios.post(
            `http://localhost:8080/api/v1/projects/accept-task`,
            {
                taskId
            },
            {
                withCredentials: true,
            }
        );
        return res.data;
    } catch (error: any) {
        console.error("Error accepting task:", error);
        return error;
    }
}

// Function for Employee to complete task or update status
export const completeTask = async (taskId: string, newStatus?: string) => {
    try {
        const payload: any = { taskId };
        if (newStatus) {
            payload.newStatus = newStatus;
        }

        const res: AxiosResponse = await axios.post(
            `http://localhost:8080/api/v1/projects/task-completion`,
            payload,
            {
                withCredentials: true,
            }
        );
        return res.data;
    } catch (error: any) {
        console.error("Error completing task:", error);
        return error;
    }
}

// Function for TeamLeader to get their assigned employees
export const getTeamLeaderAssignedEmployees = async (teamLeaderId: string, searchValue: string = "", departmentFilter: string = "") => {
    try {
        const res = await axios.get(
            `http://localhost:8080/api/v1/authentication/get-teamleader-employees/${teamLeaderId}?search=${searchValue}&department=${departmentFilter}`,
            {
                withCredentials: true,
            }
        );
        
        // Handle different response structures
        if (res.data && res.data.data) {
            return res.data.data;
        } else if (res.data && Array.isArray(res.data)) {
            return res.data;
        } else {
            console.warn("Unexpected response structure:", res.data);
            return [];
        }
    } catch (error: any) {
        console.error("Error fetching team leader employees:", error);
        return [];
    }
}

// Function for TeamLeader to get available employees they can add to their team
export const getAvailableEmployees = async (searchValue: string = "", departmentFilter: string = "") => {
    try {
        // For now, let's use the same endpoint as handleAlluser but filter for employees only
        const res = await axios.get(
            `http://localhost:8080/api/v1/authentication/get-all-users?search=${searchValue}&department=${departmentFilter}`,
            {
                withCredentials: true,
            }
        );
        
        // Filter to show only unassigned employees
        const allUsers = res.data.data;
        const availableEmployees = allUsers.filter((user: any) => 
            user.Role === "Employee" && !user.ReportingTo
        );
        
        return availableEmployees;
    } catch (error: any) {
        console.error("Error fetching available employees:", error);
        return [];
    }
}

// Function for Employee to update their profile
export const updateEmployeeProfile = async (formData: FormData, userId: string) => {
    try {
        const res = await axios.patch(
            `http://localhost:8080/api/v1/authentication/update-Profileemployee/${userId}`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return res.data;
    } catch (error: any) {
        console.error("Error updating employee profile:", error);
        return error;
    }
};

// Function for Employee to get their assigned projects
export const getEmployeeAssignedProjects = async (employeeId: string) => {
    try {
        console.log("🔍 Fetching employee assigned projects for ID:", employeeId);
        
        const res = await axios.get(
            `http://localhost:8080/api/v1/projects/get-all-projects-employee/${employeeId}`,
            {
                withCredentials: true,
            }
        );
        
        console.log("📊 Employee assigned projects response:", res.data);
        return res.data;
    } catch (error: any) {
        console.error("❌ Error fetching employee assigned projects:", error.response?.data || error.message);
        return { data: [], message: "Failed to fetch projects" };
    }
};

// Function for Manager to update project
export const updateProject = async (
    projectId: string,
    data: {
        Title?: string;
        Description?: string;
        StartDate?: Date;
        Deadline?: Date;
        assignedTo?: string[];
        Priority?: string;
        Status?: string;
    },
    files?: File[]
) => {
    try {
        const formData = new FormData();
        
        // Add text fields
        if (data.Title) formData.append('Title', data.Title);
        if (data.Description) formData.append('Description', data.Description);
        if (data.StartDate) formData.append('StartDate', data.StartDate.toISOString());
        if (data.Deadline) formData.append('Deadline', data.Deadline.toISOString());
        if (data.assignedTo) formData.append('assignedTo', data.assignedTo.join(','));
        if (data.Priority) formData.append('Priority', data.Priority);
        if (data.Status) formData.append('Status', data.Status);

        // Add files if they exist
        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append('Attachments', file);
            });
        }

        const res = await axios.put(
            `http://localhost:8080/api/v1/projects/update-project/${projectId}`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        return res.data;
    } catch (error: any) {
        console.error("Error updating project:", error);
        return error;
    }
};

// Function for TeamLeader to get their team employees for task assignment
export const getTeamLeaderTeamEmployees = async (teamLeaderId: string) => {
    try {
        const res = await axios.get(
            `http://localhost:8080/api/v1/authentication/get-teamleader-employees/${teamLeaderId}`,
            {
                withCredentials: true,
            }
        );
        
        // Handle different response structures
        if (res.data && res.data.data) {
            return res.data.data;
        } else if (res.data && Array.isArray(res.data)) {
            return res.data;
        } else {
            console.warn("Unexpected response structure:", res.data);
            return [];
        }
    } catch (error: any) {
        console.error("Error fetching team leader employees:", error);
        return [];
    }
}


