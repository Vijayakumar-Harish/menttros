import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";

export async function notificationRoutes(app: FastifyInstance) {
  app.get(
    "/me/notifications",
    { preHandler: authenticate },
    async (request) => {
      return prisma.notification.findMany({
        where: { userId: request.user!.id },
        orderBy: { createdAt: "desc" },
      });
    },
  );

  app.patch(
    "/notifications/:id/read",
    { preHandler: authenticate },
    async (request) => {
      const { id } = request.params as any;

      return prisma.notification.update({
        where: { id },
        data: { read: true },
      });
    },
  );
}
