import { Router } from 'express';
import { chatWithGroq, streamWithGroq } from '../ai/groqClient.js';

const router = Router();

// SOP Generator — streaming
router.post('/sop', async (req, res) => {
  const {
    studentName, targetUniversity, targetProgram, targetCountry,
    undergraduateDegree, cgpa, workExperience, researchPapers,
    extracurriculars, careerGoal, whyThisProgram, uniqueAngle
  } = req.body;

  const prompt = `Write a compelling Statement of Purpose (SOP) for a graduate school application.

Student Details:
- Name: ${studentName || 'Student'}
- Target: ${targetProgram || 'Masters'} at ${targetUniversity || 'Target University'}, ${targetCountry || 'USA'}
- Undergraduate: ${undergraduateDegree || 'B.Tech'}, CGPA: ${cgpa || 'N/A'}
- Work Experience: ${workExperience || 'None'}
- Research: ${researchPapers || 'None'}
- Extracurriculars: ${extracurriculars || 'None'}
- Career Goal: ${careerGoal || 'Not specified'}
- Why this program: ${whyThisProgram || 'Not specified'}
- Unique angle to highlight: ${uniqueAngle || 'Not specified'}

Write a 650–800 word SOP in first person. Structure: Opening hook (2 sentences) → Academic journey → Professional experience → Why this specific program + university → Future goals → Closing.
Make it authentic, specific, and compelling. Avoid clichés like "since childhood I have dreamed".
Reference specific professors, labs, or courses at ${targetUniversity || 'the university'} if possible.`;

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await streamWithGroq(
      [
        { role: 'system', content: 'You are an expert graduate school admissions consultant who has helped 10,000+ students get into top universities. Write with sophistication and authenticity.' },
        { role: 'user', content: prompt }
      ],
      { maxTokens: 1500, temperature: 0.75 }
    );

    if (!stream) {
      res.write(`data: ${JSON.stringify({ error: 'AI service unavailable' })}\n\n`);
      res.end();
      return;
    }

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('SOP generation error:', error.message);
    res.write(`data: ${JSON.stringify({ error: 'Generation failed' })}\n\n`);
    res.end();
  }
});

// SOP Review — non-streaming
router.post('/review', async (req, res) => {
  try {
    const { sopText, targetUniversity, targetProgram } = req.body;

    const completion = await chatWithGroq([{
      role: 'user',
      content: `Review this SOP for ${targetProgram || 'a graduate program'} at ${targetUniversity || 'the university'}.
Give exactly 3 specific, actionable improvements. Return ONLY a valid JSON array, no markdown fences:
[{"issue": "...", "fix": "...", "impact": "high|medium|low"}]
SOP: ${(sopText || '').slice(0, 3000)}`
    }], { maxTokens: 600, temperature: 0.3 });

    try {
      const cleaned = (completion || '').replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      const feedback = JSON.parse(cleaned);
      res.json({ feedback });
    } catch {
      res.json({ feedback: [], raw: completion });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
