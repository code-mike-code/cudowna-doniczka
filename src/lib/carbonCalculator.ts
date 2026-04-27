export const ABSORPTION_RATE_G = 1.3;
export const MAX_ACTIVE_DAYS = 250;
export const TREE_DAILY_G = 60.27;

export function getDaysActive(productionDate: string): number {
  const prod = new Date(productionDate);
  const now = new Date();
  const diffMs = now.getTime() - prod.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(days, 0), MAX_ACTIVE_DAYS);
}

export function totalCO2g(massKg: number, days: number): number {
  return massKg * ABSORPTION_RATE_G * days;
}

export function treeEquivalent(co2g: number): number {
  return co2g / TREE_DAILY_G;
}

export function progressPercent(days: number): number {
  return (days / MAX_ACTIVE_DAYS) * 100;
}
