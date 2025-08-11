import * as Yup from "yup";

export const UpdateSchemaYup = Yup.object({
    Username: Yup.string()
        .max(30, "Username must be 30 characters or fewer.")
        .matches(/^[a-zA-Z0-9 ]+$/, "Username must be alphanumeric.")
        .optional(),
    Phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits.")
        .optional(),
    IsActive: Yup.boolean().optional(),
    Role: Yup.string()
        .optional(),
    Department: Yup.string()
        .min(2, "Department must be at least 2 characters.")
        .optional(),
    Image: Yup.string()
        .matches(
            /^.*\.(jpg|jpeg|png|gif|webp|svg)$/,
            "Image must be a valid image file (jpg, png, etc.)"
        )
        .optional(),
});
