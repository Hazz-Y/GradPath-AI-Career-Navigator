import { Router } from 'express';
import { checkEligibility, calculateLoanDetails, getDocumentChecklist, getLenderOffers } from '../engines/loanEngine.js';
import { chatWithGroq } from '../ai/groqClient.js';

const router = Router();

// ── Session-based conversation memory ──
const conversationSessions = new Map();

// Cleanup sessions older than 2 hours — run every 30 mins
setInterval(() => {
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  for (const [id, session] of conversationSessions.entries()) {
    if (session.createdAt < cutoff) conversationSessions.delete(id);
  }
}, 30 * 60 * 1000);

router.post('/eligibility', (req, res) => {
  try {
    const eligibility = checkEligibility(req.body);
    const loanDetails = calculateLoanDetails(req.body);
    const documents = getDocumentChecklist(req.body);
    const lenders = getLenderOffers(req.body, loanDetails);

    res.json({ eligibility, loanDetails, documents, lenders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, userProfile, messages: legacyMessages, profile: legacyProfile } = req.body;

    // Support both new (sessionId-based) and legacy (messages array) format
    const useLegacy = !sessionId && legacyMessages;

    if (useLegacy) {
      // Legacy path — no memory, backwards compatible
      const profile = legacyProfile;
      const systemPrompt = buildSystemPrompt(profile);
      const completion = await chatWithGroq([
        { role: 'system', content: systemPrompt },
        ...legacyMessages
      ], { temperature: 0.6, maxTokens: 800 });

      return res.json({ reply: completion || getFallbackReply() });
    }

    // New path — session-based memory
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    // Get or create session
    if (!conversationSessions.has(sessionId)) {
      conversationSessions.set(sessionId, {
        createdAt: Date.now(),
        messages: []
      });
    }

    const session = conversationSessions.get(sessionId);

    // Build system prompt with user context
    const systemPrompt = {
      role: 'system',
      content: buildSystemPrompt(userProfile)
    };

    // Add new user message
    session.messages.push({ role: 'user', content: message });

    // Keep only last 10 messages for context window efficiency
    const recentMessages = session.messages.slice(-10);

    const completion = await chatWithGroq(
      [systemPrompt, ...recentMessages],
      { temperature: 0.6, maxTokens: 512 }
    );

    const assistantMessage = completion || getFallbackReply();

    // Save assistant response to session
    session.messages.push({ role: 'assistant', content: assistantMessage });

    res.json({
      reply: assistantMessage,
      messageCount: session.messages.length
    });
  } catch (error) {
    res.status(500).json({ error: 'AI service unavailable', fallback: 'Please try again in a moment.' });
  }
});

// Clear a conversation session
router.delete('/chat/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  conversationSessions.delete(sessionId);
  res.json({ success: true });
});

function buildSystemPrompt(profile) {
  return `You are LoanOracle, GradPath AI's expert education loan advisor for Indian students.
You have deep knowledge of NBFC education loans, interest rates (9.5%–14.5%), visa requirements, and study-abroad financing.
Be concise, empathetic, and specific. Use INR (₹) for amounts.

You know about:
- NBFC and bank education loan eligibility criteria
- Collateral requirements (usually above ₹20-50L)
- EMI calculations and repayment options
- Required documents (KYC, admission letter, income proof, etc.)
- Moratorium periods (during study + 6 months post)
- Tax benefits under Section 80E

${profile ? `Current student profile:
- Dream Score: ${profile.dreamScore || 'Not assessed yet'}
- Target Country: ${profile.targetCountry || 'Not specified'}
- Family Income: ${profile.familyIncome ? profile.familyIncome + 'L/year' : 'Not specified'}
- Loan Amount Needed: ₹${profile.loanAmount ? (profile.loanAmount / 100000).toFixed(1) + 'L' : 'Not specified'}
- Co-borrower Income: ₹${profile.coborrowerIncome || 'Not specified'}L/year
- CIBIL Score: ${profile.cibilScore || 'Not provided'}
- Collateral: ${profile.hasCollateral ? 'Available' : 'Not available'}
- University Ranking: ${profile.universityRanking || 'Not specified'}` : ''}

Always remember what the student has told you earlier in this conversation.
If they ask about their eligibility or amounts, refer to what was discussed.
Respond in a friendly, clear, and professional tone. Use bullet points where helpful.`;
}

function getFallbackReply() {
  return "I'm here to help you navigate education loan options! Could you tell me more about your plans — which country and program are you considering? I can help estimate your loan eligibility and walk you through the process.";
}

export default router;
