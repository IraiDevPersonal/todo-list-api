import type { Prisma, Task } from "@prisma/client";
import { DbClient } from "@/lib/db-client";
import { DbException } from "@/lib/exceptions/db.exception";
import type { CreateTaskModel } from "./models/create-task.model";
import type { ToggleTaskStatusModel } from "./models/toggle-task-status.model";
import type { TaskRepository } from "./respository";

export class TaskRepositoryImpl extends DbClient implements TaskRepository {
  private readonly taskSelector: Prisma.TaskSelect = {
    id: true,
    title: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    description: true,
  };

  getTasks = async (): Promise<Task[]> => {
    try {
      return await this.db.task.findMany({
        select: this.taskSelector,
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw DbException.getException(error, "Database connection error");
    }
  };

  deleteTask = async (id: string): Promise<void> => {
    try {
      await this.db.task.delete({ where: { id } });
    } catch (error) {
      throw DbException.getException(error, "Database connection error");
    }
  };

  createTask = async (payload: CreateTaskModel): Promise<Task> => {
    try {
      return await this.db.task.create({
        data: {
          title: payload.title,
          description: payload.description ?? null,
        },
        select: this.taskSelector,
      });
    } catch (error) {
      throw DbException.getException(error, "Database connection error");
    }
  };

  toggleTaskStatus = async (
    taskId: string,
    payload: ToggleTaskStatusModel
  ): Promise<Task> => {
    try {
      return await this.db.task.update({
        where: { id: taskId },
        data: payload,
        select: this.taskSelector,
      });
    } catch (error) {
      throw DbException.getException(error, "Database connection error");
    }
  };
}
