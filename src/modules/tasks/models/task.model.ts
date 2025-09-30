import type { Status } from "@prisma/client";

export type TaskModel = {
  id: string;
  title: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  description: string;
};
