import Fastify from "fastify";
import { userRoutes } from "../../app/modules/user/user.routes";

export function createServer() {
  const app = Fastify({
    logger: true,
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "menttros-backend",
    };
  });
  app.register(userRoutes, { prefix: "/api" });
  return app;
}
