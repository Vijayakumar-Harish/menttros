import { prisma } from "../../infrastructure/db/prisma";

export async function notifyUser(
  userId: string,
  title: string,
  message: string,
) {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
    },
  });
}
