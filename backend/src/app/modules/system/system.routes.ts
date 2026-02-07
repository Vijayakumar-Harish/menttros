import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";

export async function systemRoutes(app: FastifyInstance) {
    app.get('/health', async() => {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
        };
    });
    app.get("/metrics", async () => {
      const [users, skills, proofs] = await Promise.all([
        prisma.user.count(),
        prisma.skill.count(),
        prisma.proofOfWork.count({ where: { deletedAt: null } }),
      ]);

      return {
        users,
        skills,
        proofs,
      };
    });
}