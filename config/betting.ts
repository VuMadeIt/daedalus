export const BET_MIN = 5;
export const BET_MAX = 100;

export const CUPS_MIN_STAKE = 5;
export const CUPS_MAX_STAKE = 50;
const envPlays = parseInt(process.env.CUPS_PLAYS_PER_DAY ?? "", 10);
export const CUPS_PLAYS_PER_DAY = Number.isNaN(envPlays) ? 3 : envPlays;
export const CUPS_COUNT = 3;

export type BetSide = "yes" | "no";

/** What a bet would pay back in total if its side wins, given the pools before it. */
export function projectedReturn(
  amount: number,
  side: BetSide,
  yesPool: number,
  noPool: number,
) {
  const total = yesPool + noPool + amount;
  const sidePool = (side === "yes" ? yesPool : noPool) + amount;
  return Math.floor((amount * total) / sidePool);
}
