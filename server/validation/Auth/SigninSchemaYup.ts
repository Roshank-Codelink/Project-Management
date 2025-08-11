import * as Yup from "yup";
import { PasswordValidation } from "../Shared/PasswordValidation";


export let SigninSchemaYub=Yup.object({
    Email:Yup.string().email("Please Enter a Valid Email Address.").required("Email is Required."),
    Password: PasswordValidation,
})