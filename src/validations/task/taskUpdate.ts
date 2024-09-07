import { z } from "zod";

export const taskUpdateValidation = z
    .object({
        title: z.string().min(1, { message: "Title must be a non-empty string" }).optional(),
        description: z.string().min(1, { message: "Description must be a non-empty string" }).optional(),
        status: z
            .enum(["pending", "in-progress", "completed"], {
                message: "Invalid status. Status must be [pending, in-progress, completed]"
            })
            .optional(),
        priority: z
            .enum(["low", "medium", "high"], { message: "Invalid priority. Priority must be [low, medium, high]" })
            .optional()
    })
    .required();

export type TaskUpdateType = z.infer<typeof taskUpdateValidation>;
