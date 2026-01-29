export const MAX_SKILL_LEVEL = 5;

export function canLevelUp(current: number): boolean {
  return current < MAX_SKILL_LEVEL;
}
