import { prisma } from "../../infrastructure/db/prisma";
import { canLevelUp } from "../../domain/value-objects/SkillLevel";
import { MAX_SKILL_LEVEL } from "../../domain/value-objects/SkillLevel";

export async function levelUpIfEligible(learnerSkillId: string) {
  const learnerSkill = await prisma.learnerSkill.findUnique({
    where: { id: learnerSkillId },
  });

  if (!learnerSkill) return;

  if (canLevelUp(learnerSkill.level)) {
    await prisma.learnerSkill.update({
      where: { id: learnerSkillId },
      data: { level: learnerSkill.level + 1 },
    });
  }
}

export function calculateProgress(level: number): number {
  return Math.round((level / MAX_SKILL_LEVEL) * 100);
}
