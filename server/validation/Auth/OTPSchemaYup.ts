import * as Yup from "yup"

export let OtpSchemaYub = Yup.object({
   Otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .matches(/^[0-9]+$/, "OTP must be numeric")
    .required("OTP is required")
})