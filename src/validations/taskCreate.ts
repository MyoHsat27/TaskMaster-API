import { z } from "zod";

export const taskCreateValidation = z
    .object({
        title: z.string().min(1, { message: "Title is required" }),
        description: z.string().min(1, { message: "Description is required" }),
        status: z
            .enum(["pending", "in-progress", "completed"], {
                message: "Invalid status. Status must be [pending, in-progress, completed]"
            })
            .optional()
            .default("pending"),
        priority: z
            .enum(["low", "medium", "high"], { message: "Invalid priority. Priority must be [low, medium, high]" })
            .optional()
            .default("medium")
    })
    .required();

export type TaskCreateType = z.infer<typeof taskCreateValidation>;
