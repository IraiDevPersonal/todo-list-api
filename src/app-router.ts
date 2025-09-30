import { Router } from "express";
import { TaskRoutes } from "./modules/tasks/routes";

export class AppRouter {
  static get routes(): Router {
    const router = Router();
    const currentDate = new Date();

    router.get("/health", (_, res) => {
      res.json({
        status: "healthy",
        service: "Todo List API",
        version: "1.0.0",
        timestamp: currentDate.toISOString(),
      });
    });

    router.use("/api/v1", TaskRoutes.routes);

    return router;
  }
}
