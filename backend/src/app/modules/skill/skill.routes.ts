import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";

export async function skillRoutes(app: FastifyInstance) {
  app.post("/skills", async (req) => {
    const { name, description } = req.body as any;
    return prisma.skill.create({ data: { name, description } });
  });

  app.get("/skills", async () => {
    return prisma.skill.findMany();
  });
}
