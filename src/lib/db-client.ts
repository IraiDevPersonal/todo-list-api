import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export class DbClient {
  protected readonly db: PrismaClient;

  constructor() {
    this.db = prismaClient;
  }
}
