import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ElectionSetup } from './components/ElectionSetup';
import { LandingScreen } from './components/LandingScreen';
import { BallotUnit } from './components/BallotUnit';
import { ProgressIndicator } from './components/ProgressIndicator';
import { CompletionScreen } from './components/CompletionScreen';
import { AdminPanel } from './components/AdminPanel';
import { PARTY_LIBRARY } from './data/candidates';
import { initializeSession, recordVote, clearSession, hasAlreadyVoted } from './lib/session';
import type { VotingSession } from './lib/session';
import { loadElectionConfig, saveElectionConfig, type ElectionConfig } from './lib/electionConfig';
import { playConfirmationBeep } from './lib/audio';
import './App.css';

type AppState = 'setup' | 'landing' | 'voting' | 'completed' | 'already-voted';

function VotingApp() {
  const [appState, setAppState] = React.useState<AppState>('setup');
  const [session, setSession] = React.useState<VotingSession | null>(null);
  const [currentWard, setCurrentWard] = React.useState(1);
  const [electionConfig, setElectionConfig] = React.useState<ElectionConfig | null>(null);

  React.useEffect(() => {
    // Load election configuration
    const config = loadElectionConfig();
    if (config) {
      setElectionConfig(config);
      setAppState('landing');

      // Initialize session
      const existingSession = initializeSession();
      setSession(existingSession);

      // Check if already voted
      if (hasAlreadyVoted(existingSession)) {
        setAppState('already-voted');
      }
    } else {
      // No config, show setup
      setAppState('setup');
    }
  }, []);

  const handleElectionConfigured = (config: ElectionConfig) => {
    setElectionConfig(config);
    saveElectionConfig(config);
    setAppState('landing');

    // Clear any existing session and initialize new one
    clearSession();
    localStorage.removeItem('voting_session'); // Force clear session storage

    // Initialize new session
    const newSession = initializeSession();
    setSession(newSession);
  };

  const handleBeginVoting = () => {
    if (session && !hasAlreadyVoted(session)) {
      setAppState('voting');
      setCurrentWard(session.currentWard);
    }
  };

  const handleVoteCast = async (candidateId: string) => {
    if (!session) return;

    playConfirmationBeep();

    const totalWards = electionConfig?.wards || 4;
    const updatedSession = recordVote(session, currentWard, candidateId, totalWards);
    setSession(updatedSession);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (currentWard < totalWards) {
      setCurrentWard(currentWard + 1);
    } else {
      setAppState('completed');
    }
  };

  const handleReset = () => {
    clearSession();
    const newSession = initializeSession();
    setSession(newSession);
    setAppState('landing');
    setCurrentWard(1);
  };

  const getCandidatesForCurrentWard = () => {
    if (!electionConfig) return [];
    return electionConfig.candidates.filter(c => c.wardNumber === currentWard);
  };

  if (!electionConfig && appState === 'setup') {
    return <ElectionSetup onComplete={handleElectionConfigured} />;
  }

  if (!electionConfig) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingScreen onBegin={handleBeginVoting} />
          </motion.div>
        )}

        {appState === 'voting' && (
          <motion.div
            key="voting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProgressIndicator
              currentWard={currentWard}
              totalWards={electionConfig.wards}
              wardLabel={electionConfig.wardLabel}
            />
            <BallotUnit
              key={currentWard}
              candidates={getCandidatesForCurrentWard()}
              wardNumber={currentWard}
              wardLabel={electionConfig.wardLabel}
              onVoteCast={handleVoteCast}
              disabled={false}
              parties={PARTY_LIBRARY}
            />
          </motion.div>
        )}

        {appState === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CompletionScreen onReset={handleReset} />
          </motion.div>
        )}

        {appState === 'already-voted' && (
          <motion.div
            key="already-voted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="already-voted-screen"
          >
            <div className="already-voted-content">
              <h1>Already Voted</h1>
              <p>You have already cast your vote in this election.</p>
              <button
                className="reset-system-btn"
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset the entire system? This will clear all votes and configurations.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Reset System (Dev Only)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
