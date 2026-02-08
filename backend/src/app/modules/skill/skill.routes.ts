import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";
import { calculateProgress } from "../../services/skill-progress.service";
import { getCache, setCache } from "../../../infrastructure/cache/simpleCache";

export async function skillRoutes(app: FastifyInstance) {
  app.post("/skills", async (req) => {
    const { name, description } = req.body as any;
    return prisma.skill.create({ data: { name, description } });
  });

  app.get("/skills", async (request) => {
    const { q } = request.query as any;
    const cacheKey = `skills:${q ?? "all"}`;
    const cached = getCache<any[]>(cacheKey);
    if(cached) return cached;

    const skills = await prisma.skill.findMany({
      where: q
        ? {
            name: {
              contains: q,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { name: "asc" },
    });
    setCache(cacheKey, skills);

    return skills;
  });


  app.post(
    "/skills/:skillId/enroll",
    { preHandler: authenticate },
    async (request) => {
      const { skillId } = request.params as any;
      const existing = await prisma.learnerSkill.findUnique({
        where: {
          learnerId_skillId: {
            learnerId: request.user!.id,
            skillId,
          },
        },
      });
      if (existing) {
        return { message: "Already enrolled in this skill" };
      }
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
    const learnerSkills = await prisma.learnerSkill.findMany({
      where: { learnerId: request.user!.id },
      include: {
        skill: {select: {id: true, name: true}},
        proofs: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          }
        }
      }
    });
    return learnerSkills.map((ls) => ({
      ...ls,
      progress: calculateProgress(ls.level),
    }));
  });
}
