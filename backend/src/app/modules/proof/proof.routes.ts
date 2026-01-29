import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";
import { authorize } from "../../auth/authorize";
import { UserRole } from "@prisma/client";

export async function proofRoutes(app: FastifyInstance) {
  app.post(
    "/skills/:learnerSkillId/proof",
    { preHandler: authenticate },
    async (request) => {
      const { learnerSkillId } = request.params as any;
      const { title, description, url } = request.body as any;

      return prisma.proofOfWork.create({
        data: {
          learnerSkillId,
          title,
          description,
          url,
        },
      });
    },
  );

  app.patch(
    "/proof/:proofId/review",
    {
      preHandler: [authenticate, authorize([UserRole.MENTOR])],
    },
    async (request) => {
      const { proofId } = request.params as any;
      const { status } = request.body as any;

      return prisma.proofOfWork.update({
        where: { id: proofId },
        data: { status },
      });
    },
  );
}
