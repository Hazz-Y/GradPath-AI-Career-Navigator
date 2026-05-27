import { Router } from 'express';
import { chatWithGroq } from '../ai/groqClient.js';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { intake, universities, country } = req.body;

    const prompt = `Generate an application timeline for a student targeting ${intake || 'Fall 2026'} intake for ${country || 'USA'}.
${universities ? `Target universities: ${universities.join(', ')}` : ''}

Create a month-by-month timeline from NOW to the intake date with key milestones. Include:
- Entrance exam prep and dates
- University research and shortlisting
- Application document preparation (SOP, LOR, Resume)
- Application submission deadlines
- Financial planning and loan application
- Visa application steps
- Pre-departure preparation

Respond in JSON format:
[{"month": "Apr 2025", "tasks": [{"title": "...", "description": "...", "priority": "high|medium|low", "category": "test|application|financial|visa|prep"}]}]

Generate 8-12 months of timeline.`;

    const aiResponse = await chatWithGroq([{ role: 'user', content: prompt }], { temperature: 0.5, maxTokens: 2000 });

    if (aiResponse) {
      try {
        const timeline = JSON.parse(aiResponse.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
        res.json({ timeline });
      } catch (e) {
        res.json({ timeline: getDefaultTimeline(intake) });
      }
    } else {
      res.json({ timeline: getDefaultTimeline(intake) });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function getDefaultTimeline(intake) {
  return [
    { month: 'Apr 2025', tasks: [{ title: 'Start GRE/GMAT Prep', description: 'Begin structured preparation for entrance exams', priority: 'high', category: 'test' }] },
    { month: 'May 2025', tasks: [{ title: 'Research Universities', description: 'Shortlist 8-10 target universities based on profile', priority: 'high', category: 'application' }] },
    { month: 'Jun 2025', tasks: [{ title: 'Take GRE/GMAT', description: 'Complete entrance exam', priority: 'high', category: 'test' }, { title: 'Take IELTS/TOEFL', description: 'Complete language proficiency test', priority: 'high', category: 'test' }] },
    { month: 'Jul 2025', tasks: [{ title: 'Draft SOP', description: 'Write first draft of Statement of Purpose', priority: 'high', category: 'application' }, { title: 'Request LORs', description: 'Reach out to recommenders', priority: 'medium', category: 'application' }] },
    { month: 'Aug 2025', tasks: [{ title: 'Finalize University List', description: 'Confirm final shortlist of universities', priority: 'high', category: 'application' }, { title: 'Start Loan Research', description: 'Compare education loan options', priority: 'medium', category: 'financial' }] },
    { month: 'Sep 2025', tasks: [{ title: 'Complete Applications', description: 'Fill out application forms and prepare documents', priority: 'high', category: 'application' }] },
    { month: 'Oct-Nov 2025', tasks: [{ title: 'Submit Applications', description: 'Submit to all shortlisted universities', priority: 'high', category: 'application' }, { title: 'Apply for Scholarships', description: 'Submit scholarship applications', priority: 'medium', category: 'financial' }] },
    { month: 'Dec 2025', tasks: [{ title: 'Early Decision Results', description: 'Receive early admission decisions', priority: 'medium', category: 'application' }] },
    { month: 'Jan-Feb 2026', tasks: [{ title: 'Admission Decisions', description: 'Receive remaining admission decisions', priority: 'high', category: 'application' }, { title: 'Apply for Education Loan', description: 'Begin loan application process', priority: 'high', category: 'financial' }] },
    { month: 'Mar-Apr 2026', tasks: [{ title: 'Accept Offer', description: 'Choose university and accept admission', priority: 'high', category: 'application' }, { title: 'Loan Disbursement', description: 'Complete loan documentation', priority: 'high', category: 'financial' }] },
    { month: 'May-Jun 2026', tasks: [{ title: 'Visa Application', description: 'Apply for student visa with all documents', priority: 'high', category: 'visa' }, { title: 'Pre-departure Prep', description: 'Book flights, arrange accommodation', priority: 'medium', category: 'prep' }] },
    { month: 'Jul-Aug 2026', tasks: [{ title: 'Depart!', description: 'Begin your study abroad journey', priority: 'high', category: 'prep' }] }
  ];
}

export default router;
