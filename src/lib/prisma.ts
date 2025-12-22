import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prismaClient: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
}

// Lazy initialization - only create client when accessed
export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prismaClient) {
    globalForPrisma.prismaClient = createPrismaClient();
  }
  return globalForPrisma.prismaClient;
}

// Getter that lazily initializes the prisma client
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    const client = getPrismaClient();
    const value = client[prop];
    // If it's a function, bind it to the client
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
