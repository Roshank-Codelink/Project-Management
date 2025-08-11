import * as Yup from "yup"
import {  PersonalPasswordValidationWithContext } from "../Shared/PersonalPasswordValidation"

export let SignupSchemaYub = Yup.object({
  Username: Yup.string().max(10, "Username Must be 10 Characters or fewer.").matches(/^[a-zA-Z0-9 ]+$/, "Username Must be Alphanumeric.").required("Username is Required."),
  Email: Yup.string().email("Please Enter a Valid Email Address.").required("Email is Required."),
  Password:PersonalPasswordValidationWithContext(),
  confirmPassword: Yup.string().oneOf([Yup.ref("Password")], "Password Must Match.").required("Please Confirm Your Password."),
  Phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone Number Must be 10 Digits.")
    .required("Phone Number is Required."),
  Role: Yup.string().required("Role is Required."),
  Department: Yup.string().required("Department is Required.")
})