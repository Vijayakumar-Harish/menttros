import { prisma } from "../prisma";
import { UserRole } from "@prisma/client";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
  }

  async create(data: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
  }) {
    return prisma.user.create({
      data,
    });
  }
}
