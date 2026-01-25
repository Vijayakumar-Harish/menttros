import Fastify from "fastify";
import { userRoutes } from "../../app/modules/user/user.routes";

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
    app.register(userRoutes, { prefix: "/api" });
  return app;
}
