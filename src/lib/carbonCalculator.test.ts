import { describe, it, expect } from 'vitest';
import {
  getDaysActive,
  totalCO2g,
  treeEquivalent,
  progressPercent,
  MAX_ACTIVE_DAYS,
  ABSORPTION_RATE_G,
  TREE_DAILY_G,
} from './carbonCalculator';

describe('getDaysActive', () => {
  it('returns 0 for today as production date', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(getDaysActive(today)).toBe(0);
  });

  it('returns correct days for a past date', () => {
    const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    expect(getDaysActive(pastDate)).toBe(10);
  });

  it('caps at MAX_ACTIVE_DAYS (250) for old pots', () => {
    const oldDate = new Date(Date.now() - 300 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    expect(getDaysActive(oldDate)).toBe(MAX_ACTIVE_DAYS);
  });

  it('returns 0 for future production date', () => {
    const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    expect(getDaysActive(futureDate)).toBe(0);
  });
});

describe('totalCO2g', () => {
  it('calculates correctly for M pot at day 125', () => {
    // 1.2 kg * 1.3 g/kg/day * 125 days = 195g
    expect(totalCO2g(1.2, 125)).toBeCloseTo(195, 1);
  });

  it('returns 0 for day 0', () => {
    expect(totalCO2g(1.2, 0)).toBe(0);
  });

  it('calculates correctly for S pot at day 250', () => {
    // 0.45 * 1.3 * 250 = 146.25g
    expect(totalCO2g(0.45, 250)).toBeCloseTo(146.25, 2);
  });

  it('uses ABSORPTION_RATE_G constant', () => {
    expect(totalCO2g(1, 1)).toBeCloseTo(ABSORPTION_RATE_G, 5);
  });
});

describe('treeEquivalent', () => {
  it('returns 1 for exactly TREE_DAILY_G grams', () => {
    expect(treeEquivalent(TREE_DAILY_G)).toBeCloseTo(1, 5);
  });

  it('returns 0 for 0 grams', () => {
    expect(treeEquivalent(0)).toBe(0);
  });

  it('calculates fraction correctly', () => {
    expect(treeEquivalent(30.135)).toBeCloseTo(0.5, 2);
  });
});

describe('progressPercent', () => {
  it('returns 50 for day 125', () => {
    expect(progressPercent(125)).toBe(50);
  });

  it('returns 100 for day 250', () => {
    expect(progressPercent(250)).toBe(100);
  });

  it('returns 0 for day 0', () => {
    expect(progressPercent(0)).toBe(0);
  });
});
