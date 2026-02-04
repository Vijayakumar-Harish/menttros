import { FastifyInstance, FastifyReply } from "fastify";
import { prisma } from "../../../infrastructure/db/prisma";
import { authenticate } from "../../../infrastructure/auth/auth.middleware";
import { authorize } from "../../auth/authorize";
import { UserRole } from "@prisma/client";
import { levelUpIfEligible } from "../../services/skill-progress.service";
import { ProofStatus } from "../../../domain/enums/ProofStatus";
import { notifyUser } from "../../services/notification.service";

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

      const learnerSkill = await prisma.learnerSkill.findUnique({
        where: { id: learnerSkillId},
      });

      if (!learnerSkill || learnerSkill.learnerId !== request.user!.id) {
        return reply.status(403).send({
          message: "You are not allowed to submit proof for this skill",
        });
      }
      const pending = await prisma.proofOfWork.findFirst({
        where: {
          learnerSkillId,
          status: "PENDING",
          deletedAt: null,
        },
      });
      if (pending) {
        return { message: "Previous proof still under review" };
      }
      const data = prisma.proofOfWork.create({
        data: {
          learnerSkillId,
          title,
          description,
          url,
        },
      });
      const mentorSkills = await prisma.mentorSkill.findMany({
        where: {
          skillId: learnerSkill.skillId,
        },
      });

      for(const ms of mentorSkills) {
        await notifyUser(
          ms.mentorId,
          "New proof submitted",
          "A learner has submitted proof for review"
        );
      }
      return {
        success: true,
        data,
      };
    },
  );

  app.patch(
    "/proof/:proofId/review",
    {
      preHandler: [authenticate, authorize([UserRole.MENTOR])],
    },
    async (request, reply: FastifyReply) => {
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
      if (proof.learnerSkill.learnerId === request.user!.id) {
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
      const data = await prisma.proofOfWork.update({
        where: { id: proofId },
        data: { status, description: feedback ?? proof.description },
      });
      await notifyUser(
        proof.learnerSkill.learnerId,
        `Proof ${status}`,
        "Your proof has been reviewed by the mentor"
      );
      return {
        success: true,
        data,
      };
    },
  );
  app.get(
    "/mentor/proofs",
    {
      preHandler: [authenticate, authorize([UserRole.MENTOR])],
    },
    async () => {
      return prisma.proofOfWork.findMany({
        where: { status: "PENDING", deletedAt: null },
        include: {
          learnerSkill: {
            include: {
              learner: { select: { id: true, name: true } },
              skill: true,
            },
          },
          comments: {
            include: {
              author: {select: {id: true, name: true}},
            },
            orderBy: {createdAt: "asc"},
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
        where: { learnerSkillId , deletedAt: null },
        orderBy: { createdAt: "desc" },
      });
    },
  );

  app.get(
    "/mentor/learner-skills/:learnerSkillId/proofs",
    { preHandler: [authenticate, authorize([UserRole.MENTOR])] },
    async (request, reply) => {
      const { learnerSkillId } = request.params as any;

      const learnerSkill = await prisma.learnerSkill.findUnique({
        where: { id: learnerSkillId },
        include: {
          skill: {
            include: {
              mentorSkills: {
                where: { mentorId: request.user!.id },
              },
            },
          },
        },
      });

      if (!learnerSkill || learnerSkill.skill.mentorSkills.length === 0) {
        return reply.status(403).send({ message: "Not authorized" });
      }

      return prisma.proofOfWork.findMany({
        where: { learnerSkillId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      });
    },
  );
app.post(
  "/proof/:proofId/comments",
  { preHandler: authenticate },
  async (request, reply) => {
    const { proofId } = request.params as any;
    const { message } = request.body as any;

    if (!message) {
      return reply.status(400).send({ message: "Message is required" });
    }

    const proof = await prisma.proofOfWork.findUnique({
      where: { id: proofId },
      include: {
        learnerSkill: {
          include: {
            learner: true,
            skill: {
              include: {
                mentorSkills: true,
              },
            },
          },
        },
      },
    });
const recipients = new Set<string>();

recipients.add(proof!.learnerSkill.learnerId);
proof!.learnerSkill.skill.mentorSkills.forEach((ms) =>
  recipients.add(ms.mentorId),
);

recipients.delete(request.user!.id);

for (const userId of recipients) {
  await notifyUser(
    userId,
    "New comment on proof",
    "A new comment was added to a proof you are involved in",
  );
}
    if (!proof) {
      return reply.status(404).send({ message: "Proof not found" });
    }

    return prisma.proofComment.create({
      data: {
        proofId,
        authorId: request.user!.id,
        message,
      },
    });
  },
);
app.delete(
  "/proof/:proofId",
  { preHandler: authenticate },
  async (request, reply) => {
    const { proofId } = request.params as any;

    const proof = await prisma.proofOfWork.findUnique({
      where: { id: proofId },
    });

    if (!proof || proof.deletedAt) {
      return reply.status(404).send({ message: "Proof not found" });
    }

    if (proof.learnerSkillId !== proof.learnerSkillId) {
      return reply.status(403).send({ message: "Not authorized" });
    }

    return prisma.proofOfWork.update({
      where: { id: proofId },
      data: { deletedAt: new Date() },
    });
  },
);

}
