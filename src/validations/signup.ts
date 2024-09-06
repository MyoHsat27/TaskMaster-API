import { z } from "zod";

export const signUpValidation = z
    .object({
        username: z.string({ message: "require username" }),
        email: z.string({ message: "require email" }).email({ message: "format is wrong" }),
        password: z
            .string({ message: "require password" })
            .min(6, "password required at least 6 character")
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
