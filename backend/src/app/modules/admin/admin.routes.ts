import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";
import { authorize } from "../../auth/authorize";
import { UserRole } from "@prisma/client";
import { success } from "../../../infrastructure/server/response";

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
    app.get(
      "/admin/stats",
      { preHandler: [authenticate, authorize([UserRole.ADMIN])] },
      async () => {
        const [users, mentors, learners, skills, proofs, pendingProofs] =
          await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: "MENTOR" } }),
            prisma.user.count({ where: { role: "LEARNER" } }),
            prisma.skill.count(),
            prisma.proofOfWork.count(),
            prisma.proofOfWork.count({ where: { status: "PENDING" } }),
          ]);

        return success({
          users,
          mentors,
          learners,
          skills,
          proofs,
          pendingProofs,
        });
      },
    );
    app.delete(
      "/admin/users/:id",
      { preHandler: [authenticate, authorize([UserRole.ADMIN])] },
      async (request, reply) => {
        const { id } = request.params as any;

        const user = await prisma.user.findUnique({ where: { id } });

        if (!user || user.deletedAt) {
          return reply.status(404).send({ message: "User not found" });
        }

        const data = await prisma.user.update({
          where: { id },
          data: { deletedAt: new Date() },
        });

        return success(data);
      },
    );

}
