export const SOFT_STALE_MONTHS = 12;
export const HARD_STALE_MONTHS = 18;

export type StalenessLevel = 'fresh' | 'reviewed' | 'stale';
export type FreshnessSource = 'lastReviewed' | 'publishedAt';

export interface StalenessInput {
  publishedAt?: string;
  lastReviewed?: string;
  evergreen?: boolean;
  now?: Date | string;
}

export interface StalenessResult {
  level: StalenessLevel;
  freshnessDate?: string;
  freshnessSource?: FreshnessSource;
  showReviewLine: boolean;
  showNotice: boolean;
}

export function getStaleness(input: StalenessInput): StalenessResult {
  if (input.evergreen) return freshResult();

  const freshness = getFreshnessDate(input);
  if (!freshness) return freshResult();

  const now = parseDate(input.now) || new Date();
  const level = getStalenessLevel(freshness.date, now);

  return {
    level,
    freshnessDate: freshness.date.toISOString(),
    freshnessSource: freshness.source,
    showReviewLine: level === 'reviewed',
    showNotice: level === 'stale',
  };
}

export function formatContentDate(value: string, locale = 'en-US'): string {
  const date = parseDate(value);
  if (!date) return '';

  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(date);
}

function getStalenessLevel(date: Date, now: Date): StalenessLevel {
  if (addCalendarMonths(date, HARD_STALE_MONTHS) <= now) return 'stale';
  if (addCalendarMonths(date, SOFT_STALE_MONTHS) <= now) return 'reviewed';
  return 'fresh';
}

function getFreshnessDate(input: StalenessInput): { date: Date; source: FreshnessSource } | undefined {
  const lastReviewed = parseDate(input.lastReviewed);
  if (lastReviewed) return { date: lastReviewed, source: 'lastReviewed' };

  const publishedAt = parseDate(input.publishedAt);
  if (publishedAt) return { date: publishedAt, source: 'publishedAt' };

  return undefined;
}

function freshResult(): StalenessResult {
  return {
    level: 'fresh',
    showReviewLine: false,
    showNotice: false,
  };
}

function parseDate(value: Date | string | undefined): Date | undefined {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.valueOf())) return undefined;

  return date;
}

function addCalendarMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const originalDay = result.getUTCDate();

  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);

  const daysInTargetMonth = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(originalDay, daysInTargetMonth));

  return result;
}
