import Fastify from "fastify";

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

  return app;
}
