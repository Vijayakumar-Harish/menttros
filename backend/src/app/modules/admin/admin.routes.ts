import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";
import { authorize } from "../../auth/authorize";
import { UserRole } from "@prisma/client";

export async function adminRoutes(app: FastifyInstance) {
  app.get(
    "/admin/audit-logs",
    { preHandler: [authenticate, authorize([UserRole.ADMIN])] },
    async () => {
      return prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      });
    },
  );
}
