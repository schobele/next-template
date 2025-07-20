import { PrismaClient } from "@/prisma/generated/client";

export * from "@/prisma/generated/client";
export const db = new PrismaClient();
