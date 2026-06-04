/** Experience bullet counts per job (index 0 = most recent). */
export const BULLETS_PER_JOB_BY_INDEX = [10, 9, 8, 7];

export function getBulletLimitForJobIndex(jobIndex) {
  const i = Math.max(0, Number(jobIndex) || 0);
  return BULLETS_PER_JOB_BY_INDEX[Math.min(i, BULLETS_PER_JOB_BY_INDEX.length - 1)];
}

export function getMaxBulletsPerJob() {
  return Math.max(...BULLETS_PER_JOB_BY_INDEX);
}
