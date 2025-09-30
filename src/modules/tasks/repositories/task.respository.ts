import type { Task } from "@prisma/client";
import type { CreateTaskModel } from "../models/create-task.model";
import type { ToggleTaskStatusModel } from "../models/toggle-task-status.model";

export abstract class TaskRepository {
  abstract getTasks(): Promise<Task[]>;
  abstract deleteTask(id: string): Promise<void>;
  abstract createTask(payload: CreateTaskModel): Promise<Task>;
  abstract toggleTaskStatus(
    taskId: string,
    payload: ToggleTaskStatusModel
  ): Promise<Task>;
}
