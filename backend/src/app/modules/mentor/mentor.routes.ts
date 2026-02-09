import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";
import { authorize } from "../../auth/authorize";
import { UserRole } from "@prisma/client";
import { ROUTES } from "../../routes";

export async function mentorRoutes(app: FastifyInstance) {
  app.post(
    "/mentor/skills/:skillId",
    {
      preHandler: [authenticate, authorize([UserRole.MENTOR])],
    },
    async (request, reply) => {
      const { skillId } = request.params as any;
      const existing = await prisma.mentorSkill.findFirst({
        where: {
          mentorId: request.user!.id,
          skillId,
        },
      });

      if(existing) {
        return reply.status(400).send({message: "Already mentoring this skill"});
      }
      return prisma.mentorSkill.create({
        data: {
          mentorId: request.user!.id,
          skillId,
        },
      });
    },
  );

  app.get(
    ROUTES.MENTOR.LEARNERS,
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
    ROUTES.MENTOR.ANALYTICS,
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
