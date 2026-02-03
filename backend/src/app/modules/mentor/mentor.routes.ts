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

  app.get(
    "/mentor/learners",
    { preHandler: [authenticate, authorize([UserRole.MENTOR])] },
    async (request) => {
      return prisma.learnerSkill.findMany({
        where: {
          skill: {
            mentorSkills: {
              some: { mentorId: request.user!.id },
            },
          },
        },
        include: {
          learner: { select: { id: true, name: true } },
          skill: true,
        },
      });
    },
  );
  app.get(
    "/mentor/analytics",
    { preHandler: [authenticate, authorize([UserRole.MENTOR])] },
    async (request) => {
      const skillsCount = await prisma.mentorSkill.count({
        where: { mentorId: request.user!.id },
      });

      const learnersCount = await prisma.learnerSkill.count({
        where: {
          skill: {
            mentorSkills: {
              some: { mentorId: request.user!.id },
            },
          },
        },
      });

      return {
        skillsTaught: skillsCount,
        learnersHelped: learnersCount,
      };
    },
  );

}
