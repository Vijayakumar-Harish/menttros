import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { success } from "../../../infrastructure/server/response";

export async function systemRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
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
  app.get("/system/info", async () => {
    return success({
      service: "menttros-backend",
      nodeEnv: process.env.NODE_ENV,
      uptime: process.uptime(),
    });
  });

  if (process.env.NODE_ENV !== "production") {
    app.get("/debug/env", async () => {
      return {
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
      };
    });
  }
}
