import { FastifyInstance } from "fastify";
import { UserRepository } from "../../../infrastructure/db/repositories/user.repository";
import { hashPassword } from "../../../infrastructure/auth/password";
import { signAccessToken } from "../../../infrastructure/auth/jwt";
import { verifyPassword } from "../../../infrastructure/auth/password";
import { UserRole } from "@prisma/client";

const userRepo = new UserRepository();

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (request, reply) => {
    const { email, password } = request.body as any;

    const user = await userRepo.findByEmail(email);
    if (!user)
      return reply.status(401).send({ message: "Invalid credentials" });

    const valid = await verifyPassword(password, user.password);
    if (!valid)
      return reply.status(401).send({ message: "Invalid credentials" });

    const token = signAccessToken({ userId: user.id, role: user.role });
    return { accessToken: token };
  });

  app.post("/auth/register", async (request) => {
    const { email, name, password } = request.body as any;

    const hashed = await hashPassword(password);

    const user = await userRepo.create({
      email,
      name,
      password: hashed,
      role: UserRole.LEARNER,
    });
    return { id: user.id, email: user.email };
  });

  
}
