import { User } from "../../domain/entities/User";

declare module "fastify" {
  interface FastifyRequest {
    user: User | null;
    startTime: number;
  }
}
