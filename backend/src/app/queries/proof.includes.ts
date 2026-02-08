export const proofWithContext = {
  learnerSkill: {
    include: {
      learner: { select: { id: true, name: true } },
      skill: true,
    },
  },
  comments: {
    include: {
      author: { select: { id: true, name: true } },
    },
    
  },
};
