import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PARTIES } from '../data/candidates';
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

export const AdminPanel: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const [results, setResults] = useState<WardResults[]>([]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (passcode === ADMIN_PASSCODE) {
            setIsAuthenticated(true);
            setError('');
            loadResults();
        } else {
            setError('Invalid passcode');
            setPasscode('');
        }
    };

    const loadResults = () => {
        // Load all votes from localStorage
        const allVotes: Record<string, number> = {};

        // Scan localStorage for all voting sessions
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('voting_session')) {
                try {
                    const session = JSON.parse(localStorage.getItem(key) || '{}');
                    if (session.votes) {
                        Object.values(session.votes).forEach((candidateId: any) => {
                            allVotes[candidateId] = (allVotes[candidateId] || 0) + 1;
                        });
                    }
                } catch {
                    // Skip invalid sessions
                }
            }
        }

        // Also check the main session
        try {
            const mainSession = localStorage.getItem('voting_session');
            if (mainSession) {
                const session = JSON.parse(mainSession);
                if (session.votes) {
                    Object.values(session.votes).forEach((candidateId: any) => {
                        allVotes[candidateId] = (allVotes[candidateId] || 0) + 1;
                    });
                }
            }
        } catch {
            // Skip
        }

        // Calculate results per ward
        const wardResults: WardResults[] = [];

        for (let ward = 1; ward <= 4; ward++) {
            const candidates: VoteCount[] = [];
            let totalVotes = 0;

            Object.keys(PARTIES).forEach((partyCode, index) => {
                const candidateId = `W${ward}_${partyCode}`;
                const votes = allVotes[candidateId] || 0;
                totalVotes += votes;

                candidates.push({
                    candidateId,
                    candidateName: `Candidate ${String.fromCharCode(65 + index)}${ward}`,
                    partyCode,
                    votes
                });
            });

            // Sort by votes (descending)
            candidates.sort((a, b) => b.votes - a.votes);

            // Determine winner
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
                        <p className="login-subtitle">Vote Counting System</p>
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
                            Access Results
                        </button>
                    </form>

                    <div className="login-footer">
                        <span className="eci-badge-small">🇮🇳 Election Commission of India</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <div className="header-content">
                    <div className="header-title">
                        <span className="header-icon">📊</span>
                        <div>
                            <h1>Vote Counting System</h1>
                            <p>Election Results Dashboard</p>
                        </div>
                    </div>
                    <button onClick={() => setIsAuthenticated(false)} className="logout-button">
                        Logout
                    </button>
                </div>
            </div>

            <div className="results-container">
                {results.map((ward) => (
                    <motion.div
                        key={ward.wardNumber}
                        className="ward-results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: ward.wardNumber * 0.1 }}
                    >
                        <div className="ward-header">
                            <h2>Ward {ward.wardNumber}</h2>
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
                                    const party = PARTIES[candidate.partyCode];
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

                        {ward.winner && (
                            <div className="winner-announcement">
                                <span className="winner-icon">🎉</span>
                                <strong>{ward.winner.candidateName}</strong> ({PARTIES[ward.winner.partyCode].name}) wins with {ward.winner.votes} votes
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
            </div>
        </div>
    );
};
