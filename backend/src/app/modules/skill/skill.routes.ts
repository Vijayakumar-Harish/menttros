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

  app.get("/skills/:skillId/mentors", async (request) => {
    const { skillId } = request.params as any;

    return prisma.mentorSkill.findMany({
      where: { skillId },
      include: {
        mentor: { select: { id: true, name: true } },
      },
    });
  });

  app.get("/me/skills", { preHandler: authenticate }, async (request) => {
    return prisma.learnerSkill.findMany({
      where: { learnerId: request.user!.id },
      include: { skill: true },
    });
  });

  app.get("/me/learning", { preHandler: authenticate }, async (request) => {
    return prisma.learnerSkill.findMany({
      where: { learnerId: request.user!.id },
      include: {
        skill: true,
        proofs: true,
      },
    });
  });
}
