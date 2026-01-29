import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";

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
}
