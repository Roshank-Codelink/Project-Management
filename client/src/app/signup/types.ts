

export interface SingupTypeScipt {
    _id: string;
    Username: string;
    Email: string;
    Password: string;
    Phone: number | null;
    Role: string;
    Department: string;
    confirmPassword: string;
    ProfileImageUrl: string;
    IsActive: boolean,
    EmployeeId: string;
    ReportingTo?: string; // Add this property
}


export interface ProjectTypeScript {
    Title: string;
    Description: string;
    StartDate: string;
    Deadline: string;
    Status: string;
    createdBy: string;
    assignedTo: string[];
    acceptedBy?: string[];
    Priority: string;
    Attachments?: string[];
}


