import Fastify from "fastify";
import { userRoutes } from "../../app/modules/user/user.routes";
import { authRoutes } from "../../app/modules/auth/auth.routes";
import { skillRoutes } from "../../app/modules/skill/skill.routes";
import { API_V1 } from "../../app/routes";
import { proofRoutes } from "../../app/modules/proof/proof.routes";
import { mentorRoutes } from "../../app/modules/mentor/mentor.routes";

export function createServer() {
  const app = Fastify({
    logger: true,
  });
  app.addHook("onRequest", async (request) => {
    request.startTime = Date.now();
  });

  app.addHook("onResponse", async (request) => {
    const duration = Date.now() - request.startTime;
    console.log(`${request.method} ${request.url} - ${duration}ms`);
  });


  app.get("/health", async () => {
    return {
      status: "ok",
      service: "menttros-backend",
      version: "v1",
    };
  });


  app.register(authRoutes, { prefix: API_V1 });
  app.register(userRoutes, { prefix: API_V1 });
  app.register(skillRoutes, { prefix: API_V1 });
  app.register(proofRoutes, { prefix: API_V1 });
  app.register(mentorRoutes, { prefix: API_V1 });


  return app;
}
