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
      const pending = await prisma.proofOfWork.findFirst({
        where: {
          learnerSkillId,
          status: "PENDING",
        },
      });
      if (pending) {
        return { message: "Previous proof still under review" };
      }
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
  app.get(
    "/mentor/proofs",
    {
      preHandler: [authenticate, authorize([UserRole.MENTOR])],
    },
    async () => {
      return prisma.proofOfWork.findMany({
        where: { status: "PENDING" },
        include: {
          learnerSkill: {
            include: {
              learner: { select: { id: true, name: true } },
              skill: true,
            },
          },
        },
      });
    },
  );
}
