import * as Yup from "yup";

export const OtpSchemaYub = Yup.object({
    Otp: Yup.number()
        .typeError("OTP must be a number") // agar string aya to error
        .required("OTP is required")
        .min(100000, "OTP must be a 6-digit number")
        .max(999999, "OTP must be a 6-digit number"),
});
