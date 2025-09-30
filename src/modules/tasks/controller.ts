import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { Exception } from "@/lib/exceptions/exception";
import { TaskMapper } from "./mapper";
import type { TaskRepositoryImpl } from "./repositories/task.repository.impl";

export class TaskController {
  private readonly repository: TaskRepositoryImpl;

  constructor(repository: TaskRepositoryImpl) {
    this.repository = repository;
  }

  getTasks = async (_req: Request, res: Response) => {
    const responseController = new ResponseController(res);
    try {
      const tasks = await this.repository.getTasks();
      responseController.json({ data: TaskMapper.toArray(tasks) });
    } catch (error) {
      const { message, statusCode } = Exception.getExceptionData(
        error,
        "Failed to get tasks"
      );
      console.log({
        source: "TaskController/getTasks",
        message,
        error,
      });
      responseController.error(message, statusCode);
    }
  };

  createTask = async (req: Request, res: Response) => {
    const responseController = new ResponseController(res);
    try {
      const task = await this.repository.createTask(req.body);
      responseController.json({ data: TaskMapper.fromDbToDomain(task) });
    } catch (error) {
      const { message, statusCode } = Exception.getExceptionData(
        error,
        "Failed to create task"
      );
      console.log({
        source: "TaskController/createTask",
        message,
        error,
      });
      responseController.error(message, statusCode);
    }
  };

  toggleTaskStatus = async (req: Request, res: Response) => {
    const taskId = req.params.id;
    const responseController = new ResponseController(res);
    try {
      const task = await this.repository.toggleTaskStatus(taskId!, req.body);
      responseController.json({ data: TaskMapper.fromDbToDomain(task) });
    } catch (error) {
      const { message, statusCode } = Exception.getExceptionData(
        error,
        "Failed to toggle task status"
      );
      console.log({
        source: "TaskController/toggleTaskStatus",
        message,
        error,
      });
      responseController.error(message, statusCode);
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    const taskId = req.params.id;
    const responseController = new ResponseController(res);
    try {
      await this.repository.deleteTask(taskId!);
      responseController.noContent();
    } catch (error) {
      const { message, statusCode } = Exception.getExceptionData(
        error,
        "Failed to delete task"
      );
      console.log({
        source: "TaskController/deleteTask",
        message,
        error,
      });
      responseController.error(message, statusCode);
    }
  };
}
