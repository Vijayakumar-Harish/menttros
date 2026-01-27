import Fastify from "fastify";
import { userRoutes } from "../../app/modules/user/user.routes";
import { authRoutes } from "../../app/modules/auth/auth.routes";
import { skillRoutes } from "../../app/modules/skill/skill.routes";
export function createServer() {
  const app = Fastify({
    logger: true,
  });
  app.addHook("onRequest", async (request) => {
    // TEMPORARY: placeholder user
    // Tomorrow this will be replaced by JWT auth
    request.user = null;
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "menttros-backend",
    };
  });
  app.register(authRoutes, { prefix: "/api" });
  app.register(userRoutes, { prefix: "/api" });
  app.register(authRoutes, { prefix: "/api/v1" });
  app.register(userRoutes, { prefix: "/api/v1" });
  app.register(skillRoutes, { prefix: "/api/v1" });

  return app;
}
