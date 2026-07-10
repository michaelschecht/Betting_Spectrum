import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateAdvice } from '../src/server/advisor.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { prompt, currentStrategy } = req.body || {};
    const text = await generateAdvice(prompt, currentStrategy);
    res.setHeader('Content-Type', 'application/json');
    res.send(text);
  } catch (error) {
    console.error('Error in strategy advisor:', error);
    res.status(500).json({ error: 'Strategy Advisor was unable to generate response. Check your Gemini API connection.' });
  }
}
