import { Router } from 'express';
import { chatWithGroq } from '../ai/groqClient.js';

const router = Router();

router.post('/generate-content', async (req, res) => {
  try {
    const { type, profile } = req.body;
    let content = {};

    if (type === 'nudge') {
      const prompt = `Generate a WhatsApp-style nudge message for a student ${profile?.stage || 'exploring study abroad options'}. The message should be friendly, encouraging, and include an emoji. Keep it under 40 words. Just return the message text.`;
      const msg = await chatWithGroq([{ role: 'user', content: prompt }], { temperature: 0.8, maxTokens: 100 });
      content = { type: 'nudge', message: msg || "Hey! Your Dream Score is waiting — take 2 minutes to improve it today and unlock better university matches!", timestamp: new Date().toISOString() };
    } else if (type === 'blog') {
      const prompt = `Write a concise blog post snippet (title + 2 paragraph preview) about education loan tips for Indian students planning to study abroad. Make it actionable and insightful. Format: {"title": "...", "preview": "...", "readTime": "X min"}`;
      const msg = await chatWithGroq([{ role: 'user', content: prompt }], { temperature: 0.7, maxTokens: 300 });
      try {
        content = { type: 'blog', ...JSON.parse(msg.replace(/```json?\n?/g, '').replace(/```/g, '').trim()) };
      } catch {
        content = { type: 'blog', title: '5 Hidden Costs of Studying Abroad That Nobody Talks About', preview: 'When planning your education abroad budget, most students focus on tuition and forget about health insurance, currency fluctuations, and deposit requirements that can add up to ₹2-5L extra...', readTime: '4 min' };
      }
    } else if (type === 'referral') {
      content = { type: 'referral', title: 'Share & Earn', message: 'Invite a friend to GradPath AI and both earn +50 Dream Score points! Plus, unlock exclusive loan rate discounts.', code: 'GRAD' + Math.random().toString(36).substring(2, 6).toUpperCase(), reward: '+50 Dream Score Points' };
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
