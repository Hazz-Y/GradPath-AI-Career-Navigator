import { Router } from 'express';
import { getRecommendations, getAllUniversities } from '../engines/recEngine.js';
import { chatWithGroq } from '../ai/groqClient.js';

const router = Router();

router.post('/recommend', async (req, res) => {
  try {
    const recommendations = getRecommendations(req.body, { maxResults: 12 });

    // Generate AI narrative for top 3
    if (recommendations.length > 0) {
      const top3 = recommendations.slice(0, 3);
      const prompt = `You are GradPath AI's PathFinder agent. Given these top 3 university matches for a student, write a brief, encouraging 2-3 sentence personalized insight for EACH university explaining why it's a great fit. Be specific about the program strengths.

Student Profile: GPA ${req.body.gpa || 'N/A'}/10, GRE ${req.body.greScore || 'N/A'}, Target: ${req.body.courseType || 'MS'}

Universities:
${top3.map((u, i) => `${i + 1}. ${u.name} - ${u.course} (${u.country}) - Match: ${u.matchScore}%`).join('\n')}

Respond in JSON format: [{"university": "name", "insight": "..."}]`;

      const aiResponse = await chatWithGroq([{ role: 'user', content: prompt }], { temperature: 0.6 });

      if (aiResponse) {
        try {
          const insights = JSON.parse(aiResponse.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
          top3.forEach((uni, i) => {
            if (insights[i]) uni.aiInsight = insights[i].insight;
          });
        } catch (e) {
          // If AI response parsing fails, skip insights
        }
      }
    }

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/universities', (req, res) => {
  res.json(getAllUniversities());
});

// AI-powered admit probability reasoning
router.post('/explain', async (req, res) => {
  try {
    const { university, userProfile, matchScore } = req.body;

    const completion = await chatWithGroq([{
      role: 'user',
      content: `A student has a ${matchScore}% profile match with ${university?.name || 'a university'}'s ${university?.course || 'program'}.

Student: GPA ${userProfile?.gpa || 'N/A'}/10, GRE ${userProfile?.greScore || 'N/A'}, Work exp: ${userProfile?.workYears || 0} years, Field: ${userProfile?.courseType || 'MS'}
University: Ranked #${university?.ranking || 'N/A'} globally, Acceptance rate: ${university?.acceptance_rate || 'N/A'}%, Tuition: $${university?.tuition || 'N/A'}/yr

Give a response as valid JSON only (no markdown fences):
{
  "strengths": ["one specific strength", "another strength"],
  "gaps": ["one specific gap to address"],
  "boostTip": "One concrete action that would increase admit odds by 10-15%",
  "probabilityBreakdown": "One sentence explaining the match score"
}`
    }], { maxTokens: 300, temperature: 0.4 });

    try {
      const cleaned = (completion || '').replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      res.json(JSON.parse(cleaned));
    } catch {
      res.json({ strengths: [], gaps: [], boostTip: '', probabilityBreakdown: completion || '' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
