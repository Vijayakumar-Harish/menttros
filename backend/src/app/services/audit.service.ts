import { prisma } from "../../infrastructure/db/prisma";

export async function audit(
  userId: string,
  action: string,
  metadata: Record<string, any> = {},
) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      metadata,
    },
  });
}
