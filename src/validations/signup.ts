import { z } from "zod";

export const signUpValidation = z
    .object({
        username: z.string({ message: "Require username" }),
        email: z.string({ message: "Require email" }).email({ message: "Incorrect format" }),
        password: z
            .string({ message: "Require password" })
            .min(6, "Password required at least 6 character")
            .max(20, "Password must be at most 20 characters long")
            .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
            .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
            .regex(/^(?=.*\d)/, "Password must contain at least one number")
            .regex(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character"),
        confirmPassword: z.string({ message: "Please enter a confirm password" })
    })
    .required()
    .refine(
        (values) => {
            return values.password === values.confirmPassword;
        },
        {
            message: "Password and confirm password must be same",
            path: ["confirmPassword"]
        }
    );

export type SignUpUserType = z.infer<typeof signUpValidation>;
