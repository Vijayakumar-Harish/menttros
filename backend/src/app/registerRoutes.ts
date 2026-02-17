import { FastifyInstance } from "fastify";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { skillRoutes } from "./modules/skill/skill.routes";
import { proofRoutes } from "./modules/proof/proof.routes";
import { mentorRoutes } from "./modules/mentor/mentor.routes";
import { notificationRoutes } from "./modules/notification/notification.routes";
import { API_V1 } from "./routes";
import { adminRoutes } from "./modules/admin/admin.routes";

export async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: API_V1 });
  app.register(userRoutes, { prefix: API_V1 });
  app.register(skillRoutes, { prefix: API_V1 });
  app.register(proofRoutes, { prefix: API_V1 });
  app.register(mentorRoutes, { prefix: API_V1 });
  app.register(notificationRoutes, { prefix: API_V1 });
  app.register(adminRoutes, { prefix: API_V1 });
}
