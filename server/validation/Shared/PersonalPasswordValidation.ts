import * as Yup from "yup";

export const PersonalPasswordValidationWithContext = () =>
  Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .max(15, "Password must not exceed 15 characters.")
    .matches(/[A-Z]/, "Must include at least one uppercase letter.")
    .matches(/[0-9]/, "Must include at least one number.")
    .matches(/[^a-zA-Z0-9]/, "Must include one special character.")
    .test(
      "no-personal-info",
      "Password must not include your personal information.",
      function (value) {
        const parent = this.parent || {};
        const Username = parent.Username || "";
        const Email = parent.Email || "";
        const pwd = value?.toLowerCase() || "";
        const extractWords = (text: string): string[] =>
          text.toLowerCase().match(/[a-z]+/g) || [];
        const usernameParts = extractWords(Username);
        const emailParts = extractWords(Email.split("@")[0]);
        const sensitiveParts = [...usernameParts, ...emailParts];
        return sensitiveParts.every(part => !pwd.includes(part));
      }
    )
    .required("Password is required.");
