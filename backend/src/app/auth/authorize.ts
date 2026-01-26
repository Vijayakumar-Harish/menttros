import { FastifyRequest, FastifyReply } from "fastify";
import { UserRole } from "@prisma/client";

export function authorize(roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    if (!roles.includes(user.role)) {
      return reply.status(403).send({ message: "Forbidden" });
    }
  };
}
