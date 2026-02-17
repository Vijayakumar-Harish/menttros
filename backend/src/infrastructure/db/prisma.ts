import { PrismaClient } from "@prisma/client";

const basePrisma = new PrismaClient({
  log: ["error"],
});

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const start = Date.now();

        const result = await query(args);

        const duration = Date.now() - start;

        if (duration > 2000) {
          console.warn(
            `⚠️ Slow query detected: ${model}.${operation} - ${duration}ms`,
          );
        }

        return result;
      },
    },
  },
});
