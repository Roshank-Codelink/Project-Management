

import * as Yup from "yup";

export const PasswordValidation = Yup.string().required("Password is required.");
