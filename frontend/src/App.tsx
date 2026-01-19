import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingScreen } from './components/LandingScreen';
import { BallotUnit } from './components/BallotUnit';
import { ProgressIndicator } from './components/ProgressIndicator';
import { CompletionScreen } from './components/CompletionScreen';
import { AdminPanel } from './components/AdminPanel';
import { getCandidatesForWard } from './data/candidates';
import { initializeSession, recordVote, clearSession, hasAlreadyVoted } from './lib/session';
import type { VotingSession } from './lib/session';
import { playConfirmationBeep } from './lib/audio';
import './App.css';

type AppState = 'landing' | 'voting' | 'completed' | 'already-voted';

function VotingApp() {
  const [appState, setAppState] = React.useState<AppState>('landing');
  const [session, setSession] = React.useState<VotingSession | null>(null);
  const [currentWard, setCurrentWard] = React.useState(1);

  React.useEffect(() => {
    // Initialize session on mount
    const existingSession = initializeSession();
    setSession(existingSession);

    // Check if already voted
    if (hasAlreadyVoted(existingSession)) {
      setAppState('already-voted');
    }
  }, []);

  const handleBeginVoting = () => {
    if (session && !hasAlreadyVoted(session)) {
      setAppState('voting');
      setCurrentWard(session.currentWard);
    }
  };

  const handleVoteCast = async (candidateId: string) => {
    if (!session) return;

    // Play confirmation sound
    playConfirmationBeep();

    // Record vote
    const updatedSession = recordVote(session, currentWard, candidateId);
    setSession(updatedSession);

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Move to next ward or complete
    if (currentWard < 4) {
      setCurrentWard(currentWard + 1);
    } else {
      setAppState('completed');
    }
  };

  const handleReset = () => {
    // Clear session for next voter
    clearSession();
    const newSession = initializeSession();
    setSession(newSession);
    setCurrentWard(1);
    setAppState('landing');
  };

  const candidates = getCandidatesForWard(currentWard);

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingScreen onBeginVoting={handleBeginVoting} />
          </motion.div>
        )}

        {appState === 'voting' && (
          <motion.div
            key="voting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="voting-container"
          >
            <ProgressIndicator currentWard={currentWard} totalWards={4} />
            <motion.div
              key={currentWard}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <BallotUnit
                candidates={candidates}
                wardNumber={currentWard}
                onVoteCast={handleVoteCast}
              />
            </motion.div>
          </motion.div>
        )}

        {(appState === 'completed' || appState === 'already-voted') && (
          <motion.div
            key="completed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CompletionScreen onReset={handleReset} singleDeviceMode={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Admin Link (bottom-right corner) */}
      <Link to="/admin" className="admin-link" title="Admin Access">
        ⚙️
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VotingApp />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
