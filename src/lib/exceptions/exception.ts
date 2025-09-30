import type { ErrorResult } from "@/types/shared";

export class Exception extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "Exception";
    this.statusCode = statusCode;
  }

  static notFound = (message: string = "Not found"): Exception => {
    return new Exception(message, 404);
  };

  static badRequest = (message: string = "Bad request"): Exception => {
    return new Exception(message, 400);
  };

  static internalServerError = (message: string = "Internal server error"): Exception => {
    return new Exception(message, 500);
  };

  static getExceptionData(error: unknown, defaultMessage?: string): ErrorResult {
    if (error instanceof Exception) {
      return { message: error.message, statusCode: error.statusCode };
    }

    if (error instanceof Error) {
      return { message: error.message, statusCode: 500 };
    }
    return { message: defaultMessage || "An unknown error occurred", statusCode: 500 };
  }
}
