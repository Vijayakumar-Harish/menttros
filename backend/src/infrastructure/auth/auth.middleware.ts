import { FastifyRequest, FastifyReply } from "fastify";
import { verifyAccessToken } from "./jwt";
import { UserRepository } from "../db/repositories/user.repository";
import { toDomainUser } from "../db/mappers/user.mapper";

const userRepo = new UserRepository();

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = verifyAccessToken(token);
    const user = await userRepo.findById(payload.userId);

    if (!user) {
      return reply.status(401).send({ message: "User not found" });
    }

    request.user = toDomainUser(user);
  } catch {
    return reply.status(401).send({ message: "Invalid token" });
  }
}
