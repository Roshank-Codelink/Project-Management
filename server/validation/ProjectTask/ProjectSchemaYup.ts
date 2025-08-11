import * as Yup from "yup";

export const ProjectTaskYup = Yup.object({
    Title: Yup.string()
        .required("Title is required.")
        .min(5, "Title must be at least 5 characters.")
        .max(100, "Title must not exceed 100 characters."),

    Description: Yup.string()
        .required("Description is required.")
        .min(5, "Description must be at least 5 characters."),

    StartDate: Yup.date()
        .required("Start Date is required.")
        .typeError("Start Date must be a valid date."),

    Deadline: Yup.date()
        .required("Deadline is required.")
        .typeError("Deadline must be a valid date.")
        .min(Yup.ref("StartDate."), "Deadline must be after Start Date."),

    Status: Yup.string()
        .oneOf(["Pending", "Accepted", "In Progress", "Completed"], "Invalid status"),

    createdBy: Yup.string().optional(),

    assignedTo: Yup.array().required("Assigned To is required."),

    acceptedBy: Yup.string().optional(),

    employeeAssigned: Yup.string().optional(),

    Priority: Yup.string()
        .required("Priority is required.")
        .oneOf(["Low", "Medium", "High"], "Invalid priority."),

    Attachments: Yup.array()
        .of(
            Yup.string()
                .matches(/\.(jpg|jpeg|png|pdf|doc|docx)$/, "Only images, PDFs, and DOC files are allowed")
        )
        .max(5, "Maximum 5 files can be uploaded")
        .optional()

});
