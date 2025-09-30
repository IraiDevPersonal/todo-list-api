import type z from "zod";
import type { ToggleTaskStatusSchema } from "../schemas/toggle-task-status.schema";

export type ToggleTaskStatusModel = z.infer<typeof ToggleTaskStatusSchema>;
