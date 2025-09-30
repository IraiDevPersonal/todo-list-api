import { Prisma } from "@prisma/client";
import { Exception } from "./exception";

export class DbException {
  static getException(error: unknown, defaultErrorMessage?: string): Exception {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return Exception.notFound("Record not found");
        default:
          return Exception.internalServerError(error.message);
      }
    }
    return Exception.internalServerError(defaultErrorMessage);
  }
}
