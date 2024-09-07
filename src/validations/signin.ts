import { z } from "zod";

export const signInValidation = z
    .object({
        email: z.string({ message: "Require email" }).email({ message: "Incorrect format" }),
        password: z.string({ message: "Require password" })
    })
    .required();

export type SignInUserType = z.infer<typeof signInValidation>;
