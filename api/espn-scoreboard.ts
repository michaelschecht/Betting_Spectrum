import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchEspnScoreboard } from '../src/server/espn.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sport = (req.query.sport as string) || 'NFL';
    const date = (req.query.date as string) || ''; // YYYYMMDD
    const result = await fetchEspnScoreboard(sport, date);
    res.json(result);
  } catch (error) {
    console.error('Error fetching ESPN scoreboard:', error);
    res.status(500).json({ error: 'Failed to retrieve real-time ESPN scoreboard games.' });
  }
}
