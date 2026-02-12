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
      const data = await prisma.notification.findMany({
        where: { userId: request.user!.id },
        orderBy: { createdAt: "desc" },
      });
      return success(data);
    },
  );

  app.patch(
    "/notifications/:id/read",
    { preHandler: authenticate },
    async (request, reply) => {
      const { id } = request.params as any;

      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification || notification.userId !== request.user!.id) {
        return reply.status(404).send({ message: "Notification not found" });
      }

      const data = await prisma.notification.update({
        where: { id },
        data: { read: true },
      });

      return success(data);
    },
  );


  app.patch(
    "/me/notifications/read-all",
    { preHandler: authenticate },
    async (request) => {
      const result = await prisma.notification.updateMany({
        where: {
          userId: request.user!.id,
          read: false,
        },
        data: { read: true },
      });

      return success(result);
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
