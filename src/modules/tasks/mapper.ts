import type { Task } from "@prisma/client";
import type { TaskModel } from "./models/task.model";

export class TaskMapper {
  static fromDbToDomain(task: Task): TaskModel {
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      description: task.description ?? "",
    };
  }

  static toArray(tasks: Task[]): TaskModel[] {
    return tasks.map(this.fromDbToDomain);
  }
}
