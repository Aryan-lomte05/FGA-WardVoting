import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './CompletionScreen.css';

interface CompletionScreenProps {
    onReset: () => void;
    singleDeviceMode?: boolean;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
    onReset,
    singleDeviceMode = true
}) => {
    const navigate = useNavigate();

    const handleElectionOver = () => {
        navigate('/admin');
    };

    return (
        <div className="completion-screen">
            <motion.div
                className="completion-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Success Icon with Particle Effect */}
                <motion.div
                    className="success-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                    <div className="success-particles">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="particle"
                                initial={{ scale: 0, x: 0, y: 0 }}
                                animate={{
                                    scale: [0, 1, 0],
                                    x: Math.cos(i * 45 * Math.PI / 180) * 60,
                                    y: Math.sin(i * 45 * Math.PI / 180) * 60,
                                }}
                                transition={{ duration: 1, delay: 0.8 + i * 0.05 }}
                            />
                        ))}
                    </div>
                    <svg viewBox="0 0 100 100" className="checkmark">
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        />
                        <motion.path
                            d="M 25 50 L 40 65 L 75 35"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                        />
                    </svg>
                </motion.div>

                {/* Success Message */}
                <motion.h1
                    className="completion-title"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    Vote Recorded Successfully
                </motion.h1>
                <motion.p
                    className="completion-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Your vote has been securely recorded and cannot be changed.
                    <br />
                    Thank you for participating in this election.
                </motion.p>

                {/* Session Info */}
                <motion.div
                    className="session-info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                >
                    <div className="info-badge">
                        <span className="badge-icon">🔒</span>
                        <span className="badge-text">Session Locked</span>
                    </div>
                    <div className="info-badge">
                        <span className="badge-icon">✓</span>
                        <span className="badge-text">All 4 Wards Complete</span>
                    </div>
                </motion.div>

                {/* Single Device Mode - Dual Buttons */}
                {singleDeviceMode && (
                    <motion.div
                        className="next-voter-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                    >
                        <div className="divider"></div>
                        <p className="next-voter-text">What's Next?</p>

                        <div className="button-group">
                            <button className="action-button next-voter-btn" onClick={onReset}>
                                <span className="button-icon">🔄</span>
                                <span>Next Voter</span>
                            </button>

                            <button className="action-button election-over-btn" onClick={handleElectionOver}>
                                <span className="button-icon">🏁</span>
                                <span>Election Over</span>
                            </button>
                        </div>

                        <p className="admin-hint">
                            Next Voter: Continue voting | Election Over: View results
                        </p>
                    </motion.div>
                )}

                {/* Footer - Aryan's VoteHub Branding */}
                <div className="completion-footer">
                    <div className="votehub-seal">
                        <span className="seal-icon">⚡</span>
                        <span className="seal-text">Aryan's VoteHub</span>
                        <span className="seal-badge">Premium Edition</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
