import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';

import dreamScoreRoutes from './routes/dreamScore.js';
import pathfinderRoutes from './routes/pathfinder.js';
import loanOracleRoutes from './routes/loanOracle.js';
import roiCalculatorRoutes from './routes/roiCalculator.js';
import timelineRoutes from './routes/timeline.js';
import growthEngineRoutes from './routes/growthEngine.js';
import scoreBoosterRoutes from './routes/scoreBooster.js';

const REQUIRED_ENV_VARS = ['GROQ_API_KEY'];

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: [...allowedOrigins, /\.vercel\.app$/],
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_, res) => {
  res.json({ name: 'GradPath AI API', version: '1.0.0', status: 'running' });
});

app.use('/api/dream-score', dreamScoreRoutes);
app.use('/api/pathfinder', pathfinderRoutes);
app.use('/api/loan-oracle', loanOracleRoutes);
app.use('/api/roi', roiCalculatorRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/growth', growthEngineRoutes);
app.use('/api/score-booster', scoreBoosterRoutes);

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.info(`GradPath AI server running on port ${PORT}`);
});
