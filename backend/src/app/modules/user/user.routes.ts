import { FastifyInstance } from "fastify";


import { UserService } from "./user.service";

const userService = new UserService();

export async function userRoutes(app: FastifyInstance) {
  app.get("/users/me", async () => {
    const user = await userService.getOrCreateDemoUser();
    return user;
  });
}
