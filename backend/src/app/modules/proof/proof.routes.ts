import { FastifyInstance, FastifyReply } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";
import { authorize } from "../../auth/authorize";
import { UserRole } from "@prisma/client";
import { levelUpIfEligible } from "../../services/skill-progress.service";
import { ProofStatus } from "../../../domain/enums/ProofStatus";

export async function proofRoutes(app: FastifyInstance) {
  app.post(
    "/skills/:learnerSkillId/proof",
    { preHandler: authenticate },
    async (request, reply: FastifyReply) => {
      const { learnerSkillId } = request.params as any;
      const { title, description, url } = request.body as any;
      if (!title || !description) {
        return reply.status(400).send({
          message: "Title and description are required",
        });
      }

      const pending = await prisma.proofOfWork.findFirst({
        where: {
          learnerSkillId,
          status: "PENDING",
        },
      });
      if (pending) {
        return { message: "Previous proof still under review" };
      }
      return prisma.proofOfWork.create({
        data: {
          learnerSkillId,
          title,
          description,
          url,
        },
      });
    },
  );

  app.patch(
    "/proof/:proofId/review",
    {
      preHandler: [authenticate, authorize([UserRole.MENTOR])],
    },
    async (request, reply:FastifyReply) => {
      const { proofId } = request.params as any;
      const { status, feedback } = request.body as any;

      const proof = await prisma.proofOfWork.findUnique({
        where: { id: proofId },
        include: {
          learnerSkill: {
            include: { skill: true },
          },
        },
      });
      if (!proof) {
        return reply.status(404).send({ message: "Proof not found" });
      }
      if(proof.learnerSkill.learnerId === request.user!.id) {
        return reply.status(403).send({
          message: "You cannot review your own proof",
        });
      }
      const teachesSkill = await prisma.mentorSkill.findFirst({
        where: {
          mentorId: request.user!.id,
          skillId: proof!.learnerSkill.skillId,
        },
      });

      if (!teachesSkill) {
        return reply.status(403).send({ message: "Not authorized" });
      }

      if (status === ProofStatus.APPROVED) {
        await levelUpIfEligible(proof!.learnerSkillId);
      }
      return prisma.proofOfWork.update({
        where: { id: proofId },
        data: { status, description: feedback ?? proof.description },
      });
    },
  );
  app.get(
    "/mentor/proofs",
    {
      preHandler: [authenticate, authorize([UserRole.MENTOR])],
    },
    async () => {
      return prisma.proofOfWork.findMany({
        where: { status: "PENDING" },
        include: {
          learnerSkill: {
            include: {
              learner: { select: { id: true, name: true } },
              skill: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  );
  app.get(
    "/skills/:learnerSkillId/proofs",
    { preHandler: authenticate },
    async (request) => {
      const { learnerSkillId } = request.params as any;

      return prisma.proofOfWork.findMany({
        where: { learnerSkillId },
        orderBy: { createdAt: "desc" },
      });
    },
  );

}
