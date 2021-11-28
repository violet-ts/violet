import type { PrismaClient } from '@prisma/client'
export type PrismaSeeder = (prisma: PrismaClient) => Promise<void>
