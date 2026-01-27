import { hashPassword } from "../../../infrastructure/auth/password";
import { UserRepository } from "../../../infrastructure/db/repositories/user.repository";
import { UserRole } from "@prisma/client";

const userRepo = new UserRepository();

export class UserService {
  async getOrCreateDemoUser() {
    const demoId = "demo-user-id";

    const existing = await userRepo.findById(demoId);
    if (existing) return existing;

    return userRepo.create({
      email: "demo@menttros.dev",
      name: "Demo User",
      password: await hashPassword("demo123"),
      role: UserRole.LEARNER,
    });

  }
}
