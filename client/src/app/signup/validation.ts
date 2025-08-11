import * as Yup from 'yup';



export const SignupvalidationSchma = Yup.object({
    Username: Yup.string().max(10, "Username Must be 10 Characters or fewer.").matches(/^[a-zA-Z0-9 ]+$/, "Username Must be Alphanumeric.").required("Username is Required."),
    Email: Yup.string().email("Please Enter a Valid Email Address.").required("Email is Required."),
    Password: Yup.string().min(8, "Password Must be at least 8 character.")
        .max(15, "Password must be not exceed 15 characters.")
        .matches(/[A-Z]/, "Must include at least one Upercase letter.")
        .matches(/[0-9]/, "Must include at least one number.")
        .test(
            "No-Personal-Info",
            "Password must not include your personal information.",
            function (value) {
                const parents = this.parent || {};  
                const Username = parents.Username || "";
                const Email = parents.Email || "";
                const pwd = value?.toLowerCase() || "";
                const extractWords = (text: string): string[] => text.toLowerCase().match(/[a-z]+/g) || [];
                const usernameParts = extractWords(Username);
                const emailParts = extractWords(Email.split("@")[0]);
                const sensitiveParts = [...usernameParts, ...emailParts];
                return sensitiveParts.every(part => !pwd.includes(part));

            }
        ).required("Password is Required."),
    confirmPassword: Yup.string().oneOf([Yup.ref("Password")], "Password Must Match.").required("Please Confirm Your Password."),
    Phone: Yup.string().matches(/^[0-9]{10}$/, "Phone Number Must be 10 Digits.").required("Phone Number is Required."),
    Role: Yup.string().required("Role is Required."),
    Department: Yup.string().required("Department is Required."),
})



