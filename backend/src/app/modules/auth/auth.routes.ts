import { FastifyInstance } from "fastify";
import { UserRepository } from "../../../infrastructure/db/repositories/user.repository";
import { signAccessToken } from "../../../infrastructure/auth/jwt";
import { UserRole } from "@prisma/client";

const userRepo = new UserRepository();

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async () => {
    // TEMP login (email-only, demo)
    const user = await userRepo.create({
      email: "demo@menttros.dev",
      name: "Demo User",
      role: UserRole.LEARNER,
    });

    const token = signAccessToken({
      userId: user.id,
      role: user.role,
    });

    return { accessToken: token };
  });
}
