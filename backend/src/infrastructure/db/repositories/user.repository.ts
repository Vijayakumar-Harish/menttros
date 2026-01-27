import { prisma } from "../prisma";
import { UserRole } from "@prisma/client";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
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
