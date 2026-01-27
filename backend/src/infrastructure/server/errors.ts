import { FastifyInstance } from "fastify";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _, reply) => {
    app.log.error(error);
    reply.status(500).send({ message: "Internal Server Error" });
  });
}
