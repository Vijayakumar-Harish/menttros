import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";
import { authorize } from "../../auth/authorize";
import { UserRole } from "@prisma/client";

export async function mentorRoutes(app: FastifyInstance) {
  app.post(
    "/mentor/skills/:skillId",
    {
      preHandler: [authenticate, authorize([UserRole.MENTOR])],
    },
    async (request) => {
      const { skillId } = request.params as any;

      return prisma.mentorSkill.create({
        data: {
          mentorId: request.user!.id,
          skillId,
        },
      });
    },
  );
}
