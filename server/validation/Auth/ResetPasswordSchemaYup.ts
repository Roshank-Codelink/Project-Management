import * as Yup from "yup";
import {  PersonalPasswordValidationWithContext } from "../Shared/PersonalPasswordValidation";

export let ResetPasswordSchemaYup=Yup.object({
    Password:PersonalPasswordValidationWithContext()
})
