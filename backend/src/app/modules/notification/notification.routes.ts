import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";
import { ROUTES } from "../../routes";
import { success } from "../../../infrastructure/server/response";

export async function notificationRoutes(app: FastifyInstance) {
  app.get(
    ROUTES.NOTIFICATIONS.LIST,
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

  app.patch(
    "/me/notifications/read-all",
    { preHandler: authenticate },
    async (request) => {
      return prisma.notification.updateMany({
        where: {
          userId: request.user!.id,
          read: false,
        },
        data: { read: true },
      });
    },
  );

  app.get(
    "/me/notifications/unread-count",
    { preHandler: authenticate },
    async (request) => {
      const count = await prisma.notification.count({
        where: {
          userId: request.user!.id,
          read: false,
        },
      });

      return success({count});
    },
  );

}
