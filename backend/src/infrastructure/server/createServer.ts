import Fastify from "fastify";
import { userRoutes } from "../../app/modules/user/user.routes";
import { authRoutes } from "../../app/modules/auth/auth.routes";
import { skillRoutes } from "../../app/modules/skill/skill.routes";
import { API_V1 } from "../../app/routes";
import { proofRoutes } from "../../app/modules/proof/proof.routes";
import { mentorRoutes } from "../../app/modules/mentor/mentor.routes";
import { registerRoutes } from "../../app/registerRoutes";
import { success } from "./response";
import rateLimit from "@fastify/rate-limit";

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

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    reply.status(error.statusCode || 500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  });

  app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
  // app.register(authRoutes, { prefix: API_V1 });
  // app.register(userRoutes, { prefix: API_V1 });
  // app.register(skillRoutes, { prefix: API_V1 });
  // app.register(proofRoutes, { prefix: API_V1 });
  // app.register(mentorRoutes, { prefix: API_V1 });

  registerRoutes(app);


  return app;
}
