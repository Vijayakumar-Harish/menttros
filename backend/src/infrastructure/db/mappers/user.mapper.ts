import { User as PrismaUser } from "@prisma/client";
import { User } from "../../../domain/entities/User";

export function toDomainUser(user: PrismaUser): User {
  return new User({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  });
}
