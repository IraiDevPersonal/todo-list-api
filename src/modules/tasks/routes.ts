import { Router } from "express";
import { ValidationMiddleware } from "@/lib/middlewares/validation.middleware";
import { IdParamSchema } from "@/lib/schemas/shared";
import { TaskController } from "./controller";
import { TaskRepositoryImpl } from "./repository.impl";
import { CreateTaskSchema } from "./schemas/create-task-schema";
import { ToggleTaskStatusSchema } from "./schemas/toggle-task-status.schema";

const valiteRequest = ValidationMiddleware.validateRequest;

export class TaskRoutes {
  private static readonly repository = new TaskRepositoryImpl();
  private static readonly controller = new TaskController(this.repository);

  static get routes(): Router {
    const router = Router();

    router.get("/tasks", this.controller.getTasks);
    router.post(
      "/tasks",
      [valiteRequest({ body: CreateTaskSchema })],
      this.controller.createTask
    );
    router.delete(
      "/tasks/:id",
      [valiteRequest({ params: IdParamSchema })],
      this.controller.deleteTask
    );
    router.put(
      "/tasks/:id",
      [valiteRequest({ params: IdParamSchema, body: ToggleTaskStatusSchema })],
      this.controller.toggleTaskStatus
    );

    return router;
  }
}
