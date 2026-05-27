import { Routes, Route } from 'react-router-dom'
import { useState, createContext } from 'react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Quiz from './pages/Quiz'
import Dashboard from './pages/Dashboard'
import PathFinder from './pages/PathFinder'
import LoanOracle from './pages/LoanOracle'
import LoanConfirmation from './pages/LoanConfirmation'
import ScoreBooster from './pages/ScoreBooster'
import GrowthEngineRoom from './pages/GrowthEngineRoom'
import ROICalculator from './pages/ROICalculator'
import Timeline from './pages/Timeline'

export const AppContext = createContext();

function App() {
  const [userData, setUserData] = useState(null);
  const [dreamScore, setDreamScore] = useState(null);
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('gradpath_streak');
    return saved ? parseInt(saved) : 0;
  });

  const updateStreak = () => {
    const lastVisit = localStorage.getItem('gradpath_last_visit');
    const today = new Date().toDateString();
    if (lastVisit !== today) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('gradpath_streak', newStreak);
      localStorage.setItem('gradpath_last_visit', today);
    }
  };

  return (
    <AppContext.Provider value={{ userData, setUserData, dreamScore, setDreamScore, streak, updateStreak }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pathfinder" element={<PathFinder />} />
        <Route path="/loans" element={<LoanOracle />} />
        <Route path="/loan-confirmation" element={<LoanConfirmation />} />
        <Route path="/scorebooster" element={<ScoreBooster />} />
        <Route path="/growth" element={<GrowthEngineRoom />} />
        <Route path="/roi" element={<ROICalculator />} />
        <Route path="/timeline" element={<Timeline />} />
      </Routes>
    </AppContext.Provider>
  )
}

export default App
