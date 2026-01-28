import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";

export async function skillRoutes(app: FastifyInstance) {
  app.post("/skills", async (req) => {
    const { name, description } = req.body as any;
    return prisma.skill.create({ data: { name, description } });
  });

  app.get("/skills", async () => {
    return prisma.skill.findMany();
  });

  app.post(
    "/skills/:skillId/enroll",
    { preHandler: authenticate },
    async (request) => {
      const { skillId } = request.params as any;

      return prisma.learnerSkill.create({
        data: {
          learnerId: request.user!.id,
          skillId,
        },
      });
    },
  );
}
