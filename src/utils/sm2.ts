export type SM2State = {
  interval: number;
  repetition: number;
  easeFactor: number;
};

export type SM2Result = SM2State & {
  nextReview: Date;
};

const MIN_EASE_FACTOR = 1.3;
const INITIAL_EASE_FACTOR = 2.5;

function clampQuality(quality: number) {
  return Math.max(0, Math.min(5, Math.round(quality)));
}

export function calculateSM2(qualityInput: number, current: SM2State): SM2State {
  const quality = clampQuality(qualityInput);
  const currentEase = Number.isFinite(current.easeFactor)
    ? current.easeFactor
    : INITIAL_EASE_FACTOR;

  if (quality < 3) {
    return {
      interval: 1,
      repetition: 0,
      easeFactor: Math.max(MIN_EASE_FACTOR, currentEase - 0.2),
    };
  }

  const easeFactor = Math.max(
    MIN_EASE_FACTOR,
    currentEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  const repetition = current.repetition + 1;
  let interval = 1;

  if (repetition === 1) {
    interval = 1;
  } else if (repetition === 2) {
    interval = 6;
  } else {
    interval = Math.round(Math.max(1, current.interval) * easeFactor);
  }

  return { interval, repetition, easeFactor };
}

export function scheduleNextReview(
  quality: number,
  current: SM2State,
  fromDate = new Date(),
): SM2Result {
  const result = calculateSM2(quality, current);
  const nextReview = new Date(fromDate);
  nextReview.setDate(nextReview.getDate() + result.interval);

  return {
    ...result,
    nextReview,
  };
}
