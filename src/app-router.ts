import { Router } from "express";

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

    return router;
  }
}
