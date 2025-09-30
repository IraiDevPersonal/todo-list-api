import type { Server } from "node:http";
import { Server as SocketServer } from "socket.io";
import { ENVS } from "./config";
import { logger } from "./logger";

export class WebSocketServer {
  public readonly io: SocketServer;

  constructor(httpServer: Server) {
    this.io = new SocketServer(httpServer, {
      cors: this.getCorsConfig(),
    });

    this.setupSocketIO();
  }

  protected getCorsConfig() {
    const isDevelopment = ENVS.NODE_ENV !== "production";

    if (isDevelopment) {
      return {
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      };
    }

    const allowedOrigins = this.getAllowedOrigins();

    return {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    };
  }

  protected getAllowedOrigins(): string[] {
    const origins: string[] = [];

    if (ENVS.ALLOWED_ORIGINS) {
      const additionalOrigins = ENVS.ALLOWED_ORIGINS.map((origin) =>
        origin.trim()
      ).filter((origin) => origin.length > 0);

      origins.push(...additionalOrigins);
    }

    logger.info(`Allowed WebSocket origins: ${origins.join(", ")}`);
    return origins;
  }

  private setupSocketIO() {
    this.io.on("connection", (socket) => {
      logger.info(`Web Socket Client connected: ${socket.id}`);

      socket.on("disconnect", () => {
        logger.info(`Web Socket Client disconnected: ${socket.id}`);
      });
    });
  }
}
