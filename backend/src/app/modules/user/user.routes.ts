import { FastifyInstance } from "fastify";

export async function userRoutes(app: FastifyInstance) {
  app.get("/users/me", async () => {
    return {
      id: "demo-id",
      name: "Demo User",
      role: "LEARNER",
    };
  });
}
