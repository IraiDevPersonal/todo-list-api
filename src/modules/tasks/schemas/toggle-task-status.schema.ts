import { Status } from "@prisma/client";
import z from "zod";

export const ToggleTaskStatusSchema = z.object({
  status: z.enum(Status),
});
