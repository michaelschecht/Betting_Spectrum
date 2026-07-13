import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runValidatedBacktest, BadRequestError } from '../src/server/backtest.js';
import type { Strategy } from '../src/types.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const result = runValidatedBacktest(req.body as Strategy);
    res.json(result);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error running backtest:', error);
    res.status(500).json({ error: 'Internal Backtest Engine Error' });
  }
}
