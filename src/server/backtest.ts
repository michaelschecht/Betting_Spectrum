import { runBacktest } from '../dataGenerator.js';
import type { Strategy } from '../types.js';

/** Thrown when a backtest request is missing required strategy fields. */
export class BadRequestError extends Error {}

/**
 * Validate the core strategy parameters and run the backtest engine.
 * Shared by the local Express dev server (`server.ts`) and the Vercel
 * serverless function (`api/backtest.ts`).
 */
export function runValidatedBacktest(strategy: Strategy) {
  if (
    !strategy?.sport ||
    !strategy?.startYear ||
    !strategy?.endYear ||
    !strategy?.betType ||
    !strategy?.sideSelection
  ) {
    throw new BadRequestError('Missing core strategy parameters');
  }
  return runBacktest(strategy);
}
