import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function resolveDatabaseUrl(): string {
  // Absolute file: URLs are used as-is (e.g. hosted/config override).
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("file:/")) {
    return process.env.DATABASE_URL;
  }
  // For relative/undefined URLs, resolve db/custom.db against the runtime cwd
  // so the SQLite file location is deterministic in dev and production.
  const root = path.resolve(process.cwd());
  return `file:${path.join(root, "db", "custom.db")}`;
}

process.env.DATABASE_URL = resolveDatabaseUrl();

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db