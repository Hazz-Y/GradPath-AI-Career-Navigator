import { Router } from 'express';
import { calculateDreamScore, getBoosterTips } from '../engines/scoreEngine.js';

const router = Router();

router.post('/calculate', (req, res) => {
  try {
    const result = calculateDreamScore(req.body);
    const tips = getBoosterTips(result.breakdown, req.body);
    res.json({ ...result, tips });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
