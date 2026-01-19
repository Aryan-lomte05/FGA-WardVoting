import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PARTY_LIBRARY } from '../data/candidates';
import { getAllVoterSessions, clearAllVotes } from '../lib/session';
import type { VotingSession } from '../lib/session';
import { loadElectionConfig, getDefaultConfig, clearElectionConfig } from '../lib/electionConfig';
import type { ElectionConfig } from '../lib/electionConfig';
import './AdminPanel.css';

const ADMIN_PASSCODE = '12345';

interface VoteCount {
    candidateId: string;
    candidateName: string;
    partyCode: string;
    votes: number;
}

interface WardResults {
    wardNumber: number;
    candidates: VoteCount[];
    totalVotes: number;
    winner: VoteCount | null;
}

type TabType = 'results' | 'logs';

export const AdminPanel: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('results');
    const [results, setResults] = useState<WardResults[]>([]);
    const [voterSessions, setVoterSessions] = useState<VotingSession[]>([]);
    const [config, setConfig] = useState<ElectionConfig | null>(null);

    useEffect(() => {
        // Load config purely for display info, fallback to default if missing
        const loadedConfig = loadElectionConfig() || getDefaultConfig();
        setConfig(loadedConfig);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (passcode === ADMIN_PASSCODE) {
            setIsAuthenticated(true);
            setError('');
            loadData();
        } else {
            setError('Invalid passcode');
            setPasscode('');
        }
    };

    const loadData = () => {
        // Ensure we have the latest config logic
        const currentConfig = loadElectionConfig() || getDefaultConfig();
        setConfig(currentConfig);

        // Load voter sessions
        const sessions = getAllVoterSessions();
        setVoterSessions(sessions);

        // Calculate vote counts
        const allVotes: Record<string, number> = {};

        sessions.forEach(session => {
            if (session.votes) {
                Object.values(session.votes).forEach((candidateId: any) => {
                    allVotes[candidateId] = (allVotes[candidateId] || 0) + 1;
                });
            }
        });

        // Calculate results per ward based on CONFIG
        const wardResults: WardResults[] = [];
        const numWards = currentConfig.wards;
        const partyCodes = currentConfig.partyCodes;

        for (let ward = 1; ward <= numWards; ward++) {
            const candidates: VoteCount[] = [];
            let totalVotes = 0;

            partyCodes.forEach((partyCode, index) => {
                const candidateId = `W${ward}_${partyCode}`;
                const votes = allVotes[candidateId] || 0;
                totalVotes += votes;

                // Construct candidate name consistent with generation logic
                const candidateName = `Candidate ${String.fromCharCode(65 + index)}${ward}`;

                candidates.push({
                    candidateId,
                    candidateName,
                    partyCode,
                    votes
                });
            });

            candidates.sort((a, b) => b.votes - a.votes);
            const winner = candidates[0].votes > 0 ? candidates[0] : null;

            wardResults.push({
                wardNumber: ward,
                candidates,
                totalVotes,
                winner
            });
        }

        setResults(wardResults);
    };

    const handleNewElection = () => {
        if (confirm('⚠️ This will delete ALL votes and start a new election. Are you sure?')) {
            clearAllVotes();
            loadData();
            alert('✅ All votes cleared! New election started.');
        }
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getCandidateName = (candidateId: string) => {
        if (!config) return candidateId;

        const [ward, partyCode] = candidateId.split('_');
        const wardNum = ward.replace('W', '');

        // Find index in configured parties
        const partyIndex = config.partyCodes.indexOf(partyCode);
        if (partyIndex === -1) return candidateId; // Fallback if party not found in current config

        return `Candidate ${String.fromCharCode(65 + partyIndex)}${wardNum}`;
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login">
                <motion.div
                    className="login-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="login-header">
                        <div className="admin-icon">🔐</div>
                        <h1 className="login-title">Admin Access</h1>
                        <p className="login-subtitle">Aryan's EVM Control Panel</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="passcode">Enter Passcode</label>
                            <input
                                id="passcode"
                                type="password"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                placeholder="•••••"
                                className="passcode-input"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <motion.div
                                className="error-message"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <button type="submit" className="login-button">
                            Access Control Panel
                        </button>
                    </form>

                    <div className="login-footer">
                        <span className="evm-badge-small">⚡ Aryan's EVM</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            {/* Header */}
            <div className="admin-header">
                <div className="header-content">
                    <div className="header-title">
                        <span className="header-icon">⚡</span>
                        <div>
                            <h1>Aryan's EVM Control Panel</h1>
                            <p>{config?.name || 'Election Management Dashboard'}</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button onClick={handleNewElection} className="new-election-btn">
                            <span>🔄</span>
                            <span>Reset Votes</span>
                        </button>
                        <button onClick={() => {
                            if (confirm('Go back to Election Setup? This will end the current election.')) {
                                clearElectionConfig();
                                navigate('/');
                            }
                        }} className="home-btn">
                            <span>🏠</span>
                            <span>Setup</span>
                        </button>
                        <button onClick={() => setIsAuthenticated(false)} className="logout-button">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
                    onClick={() => setActiveTab('results')}
                >
                    <span className="tab-icon">📊</span>
                    <span>Results</span>
                    <span className="tab-badge">{voterSessions.length} votes</span>
                </button>
                <button
                    className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('logs')}
                >
                    <span className="tab-icon">📋</span>
                    <span>Voter Logs</span>
                    <span className="tab-badge">{voterSessions.length} voters</span>
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                <AnimatePresence mode="wait">
                    {activeTab === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="results-container"
                        >
                            {results.map((ward) => (
                                <motion.div
                                    key={ward.wardNumber}
                                    className="ward-results"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: ward.wardNumber * 0.1 }}
                                >
                                    <div className="ward-header">
                                        <h2>{config?.wardLabel || 'Ward'} {ward.wardNumber}</h2>
                                        <div className="total-votes">
                                            Total Votes: <strong>{ward.totalVotes}</strong>
                                        </div>
                                    </div>

                                    <table className="results-table">
                                        <thead>
                                            <tr>
                                                <th>Rank</th>
                                                <th>Candidate</th>
                                                <th>Party</th>
                                                <th>Symbol</th>
                                                <th>Votes</th>
                                                <th>%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ward.candidates.map((candidate, index) => {
                                                const party = PARTY_LIBRARY[candidate.partyCode] || PARTY_LIBRARY.PA; // Fallback
                                                const percentage = ward.totalVotes > 0
                                                    ? ((candidate.votes / ward.totalVotes) * 100).toFixed(1)
                                                    : '0.0';
                                                const isWinner = ward.winner?.candidateId === candidate.candidateId;

                                                return (
                                                    <tr
                                                        key={candidate.candidateId}
                                                        className={isWinner ? 'winner-row' : ''}
                                                    >
                                                        <td className="rank-cell">
                                                            {isWinner && <span className="winner-badge">🏆</span>}
                                                            {index + 1}
                                                        </td>
                                                        <td className="candidate-cell">{candidate.candidateName}</td>
                                                        <td className="party-cell">
                                                            <span className="party-tag" style={{ borderColor: party.color }}>
                                                                {party.name}
                                                            </span>
                                                        </td>
                                                        <td className="symbol-cell">{party.symbol}</td>
                                                        <td className="votes-cell">
                                                            <strong>{candidate.votes}</strong>
                                                        </td>
                                                        <td className="percentage-cell">
                                                            <div className="percentage-bar">
                                                                <div
                                                                    className="percentage-fill"
                                                                    style={{
                                                                        width: `${percentage}%`,
                                                                        backgroundColor: party.color
                                                                    }}
                                                                />
                                                                <span className="percentage-text">{percentage}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                    {ward.winner && PARTY_LIBRARY[ward.winner.partyCode] && (
                                        <div className="winner-announcement">
                                            <span className="winner-icon">🎉</span>
                                            <strong>{ward.winner.candidateName}</strong> ({PARTY_LIBRARY[ward.winner.partyCode].name}) wins with {ward.winner.votes} votes
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {results.length === 0 && (
                                <div className="no-results">
                                    <span className="no-results-icon">📭</span>
                                    <p>No votes recorded yet</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'logs' && (
                        <motion.div
                            key="logs"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="logs-container"
                        >
                            {voterSessions.map((session, index) => (
                                <motion.div
                                    key={session.sessionId}
                                    className="voter-log-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="log-header">
                                        <div className="voter-info">
                                            <span className="voter-number">Voter #{session.voterNumber}</span>
                                            <span className="voter-time">{formatTime(session.completedAt || session.createdAt)}</span>
                                        </div>
                                        <div className="session-id">ID: {session.sessionId.slice(-8)}</div>
                                    </div>

                                    <div className="log-votes">
                                        {/* Use configured number of wards for looping logs too */}
                                        {Array.from({ length: config?.wards || 4 }, (_, i) => i + 1).map(ward => {
                                            const candidateId = session.votes[ward];
                                            if (!candidateId) return null;

                                            const [, partyCode] = candidateId.split('_');
                                            const party = PARTY_LIBRARY[partyCode] || PARTY_LIBRARY.PA;

                                            return (
                                                <div key={ward} className="vote-item">
                                                    <span className="ward-label">{config?.wardLabel || 'Ward'} {ward}</span>
                                                    <span className="vote-arrow">→</span>
                                                    <span className="vote-choice">
                                                        <span className="choice-symbol">{party.symbol}</span>
                                                        <span className="choice-name">{getCandidateName(candidateId)}</span>
                                                        <span className="choice-party" style={{ color: party.color }}>
                                                            {party.name}
                                                        </span>
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}

                            {voterSessions.length === 0 && (
                                <div className="no-results">
                                    <span className="no-results-icon">📋</span>
                                    <p>No voter logs yet</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
