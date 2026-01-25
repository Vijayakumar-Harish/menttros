import { prisma } from "../prisma";
import { UserRole } from "@prisma/client";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: { email: string; name: string; role: UserRole }) {
    return prisma.user.create({
      data,
    });
  }
}
