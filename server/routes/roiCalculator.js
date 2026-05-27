import { Router } from 'express';
import { calculateROI } from '../engines/roiEngine.js';

const router = Router();

router.post('/calculate', (req, res) => {
  try {
    const result = calculateROI(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
