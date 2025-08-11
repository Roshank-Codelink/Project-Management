import * as Yup from "yup";

export const EmailSchemaYub = Yup.object({
    Email: Yup.string().email("Please Enter a Valid Email Address.").required("Email is Required."),
})