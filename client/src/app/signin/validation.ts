import * as yup from "yup";

export const SigninvalidationSchma = yup.object({
    Email: yup.string().email("Please Enter a Valid Email Address.").required("Email is Required."),
    Password: yup.string().required("Password is Required."),
})