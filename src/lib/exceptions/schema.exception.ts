import z from "zod";

export class SchemaException {
  static getExceptionMessage(error: z.ZodError): string {
    const issueMessages = error.issues
      .map(
        (issue) => `field [${issue.path.join(".")}] ${issue.message.toLocaleLowerCase()}`
      )
      .join(", ");

    return issueMessages;
  }

  static isSchemaException(error: unknown): error is z.ZodError {
    return error instanceof z.ZodError;
  }
}
