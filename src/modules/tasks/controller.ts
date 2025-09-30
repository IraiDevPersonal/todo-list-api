import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { Exception } from "@/lib/exceptions/exception";
import { logger } from "@/lib/logger";
import { TaskMapper } from "./mapper";
import { SocketEvents } from "./models/task-socket-envents.model";
import type { TaskRepository } from "./respository";

export class TaskController {
  private readonly repository: TaskRepository;

  constructor(repository: TaskRepository) {
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
      logger.error({
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
      const payload = req.body;
      const task = await this.repository.createTask(payload);
      const newTask = TaskMapper.fromDbToDomain(task);

      req.io?.emit(SocketEvents.TASK_CREATED, newTask);

      responseController.json({ data: newTask });
    } catch (error) {
      const { message, statusCode } = Exception.getExceptionData(
        error,
        "Failed to create task"
      );
      logger.error({
        source: "TaskController/createTask",
        message,
        error,
      });
      responseController.error(message, statusCode);
    }
  };

  toggleTaskStatus = async (req: Request, res: Response) => {
    const taskId = req.params.id!;
    const responseController = new ResponseController(res);
    try {
      const payload = req.body;
      const task = await this.repository.toggleTaskStatus(taskId, payload);
      const updateTask = TaskMapper.fromDbToDomain(task);

      req.io?.emit(SocketEvents.TASK_TOGGLE_STATUS, updateTask);

      responseController.json({ data: updateTask });
    } catch (error) {
      const { message, statusCode } = Exception.getExceptionData(
        error,
        "Failed to toggle task status"
      );
      logger.error({
        source: "TaskController/toggleTaskStatus",
        message,
        error,
      });
      responseController.error(message, statusCode);
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    const taskId = req.params.id!;
    const responseController = new ResponseController(res);
    try {
      await this.repository.deleteTask(taskId);

      req.io?.emit(SocketEvents.TASK_DELETED, taskId);

      responseController.noContent();
    } catch (error) {
      const { message, statusCode } = Exception.getExceptionData(
        error,
        "Failed to delete task"
      );
      logger.error({
        source: "TaskController/deleteTask",
        message,
        error,
      });
      responseController.error(message, statusCode);
    }
  };
}
