import { createServer, type Server as HttpServer } from "node:http";
import cors from "cors";
import express, { type Express, type Router } from "express";
import helmet from "helmet";
import { logger } from "./lib/logger";
import { WebSocketServer } from "./lib/web-socket-server";

type Options = {
  port: number;
  routes: Router;
};

export class Server extends WebSocketServer {
  private readonly httpServer: HttpServer;
  private serverListener?: HttpServer;
  private readonly routes: Router;
  private readonly port: number;
  public readonly app: Express;

  constructor({ port, routes }: Options) {
    const appInstance = express();
    const httpServerInstance = createServer(appInstance);

    super(httpServerInstance);

    this.httpServer = httpServerInstance;
    this.app = appInstance;
    this.routes = routes;
    this.port = port;
  }

  private getHelmetConfig() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'", // Permite scripts inline (para la implementacion de socket.io en el public)
            "https://cdn.socket.io", // para CDN de Socket.io
            "https://cdn.jsdelivr.net", // para CDN de tailwind
          ],
          connectSrc: [
            "'self'",
            "ws:",
            "wss:",
            "https://cdn.socket.io",
            "https://cdn.jsdelivr.net",
          ], // Permite WebSocket y CDN
        },
      },
    });
  }

  async start() {
    //* Middlewares generales
    this.app.use(this.getHelmetConfig());
    this.app.use(cors(this.getCorsConfig()));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

    this.app.use(express.static("public"));

    // Middleware para inyectar io en las peticiones
    this.app.use((req, _res, next) => {
      req.io = this.io;
      next();
    });

    //* Rutas de la aplicacion
    this.app.use(this.routes);

    this.serverListener = this.httpServer.listen(this.port, () => {
      logger.info(`Server running on port: ${this.port}`);
      logger.info(`WebSocket server ready`);
    });
  }

  close() {
    this.io.close();
    this.serverListener?.close();
  }
}
