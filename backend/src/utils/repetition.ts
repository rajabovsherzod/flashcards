import { LearningMode } from "@generated/prisma"
const intervals = {
    NORMAL: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
    CRAM:   [0, 0.007, 0.02, 0.08, 0.2, 0.5, 1],
    LAZY:   [0, 2, 4, 7, 12, 21, 35, 60, 100],
};

export const getIntervalForStage = (stage: number, mode: LearningMode): number => {
    const selectedIntervals = intervals[mode];
  
    if (stage >= selectedIntervals.length) {
      return selectedIntervals[selectedIntervals.length - 1];
    }
    if (stage < 0) {
      return selectedIntervals[0];
    }

    return selectedIntervals[stage];
};

export const calculateNextStage = (currentStage: number, knewIt: boolean, mode: LearningMode): number => {
    if (knewIt) {
      return currentStage + 1;
    }
  
    switch (mode) {
      case 'CRAM':
        return Math.max(0, currentStage - 2);
      case 'NORMAL':
        return Math.max(0, currentStage - 1);
      case 'LAZY':
        return currentStage;
      default:
        return currentStage;
    }
};