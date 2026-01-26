import { FastifyInstance } from "fastify";

import { UserService } from "./user.service";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";

const userService = new UserService();

export async function userRoutes(app: FastifyInstance) {
  app.get("/users/me", { preHandler: authenticate }, async(request) => {
    return request.user;
  }
);
}
