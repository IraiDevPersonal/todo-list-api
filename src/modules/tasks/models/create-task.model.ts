import type z from "zod";
import type { CreateTaskSchema } from "../schemas/create-task-schema";

export type CreateTaskModel = z.infer<typeof CreateTaskSchema>;
