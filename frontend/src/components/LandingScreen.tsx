import React from 'react';
import { motion } from 'framer-motion';
import './LandingScreen.css';

interface LandingScreenProps {
    onBeginVoting: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onBeginVoting }) => {
    return (
        <div className="landing-screen">
            <motion.div
                className="landing-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Aryan's EVM Logo */}
                <div className="eci-logo">
                    <div className="emblem">⚡</div>
                    <h1 className="eci-title">Aryan's EVM</h1>
                    <div className="eci-subtitle">Premium Voting System</div>
                </div>

                {/* Instructions */}
                <div className="instructions-card">
                    <h2 className="instructions-title">Voting Instructions</h2>
                    <ul className="instructions-list">
                        <li>
                            <span className="instruction-icon">1️⃣</span>
                            <span>You will vote for <strong>4 wards</strong> sequentially</span>
                        </li>
                        <li>
                            <span className="instruction-icon">2️⃣</span>
                            <span>Select <strong>one candidate</strong> per ward</span>
                        </li>
                        <li>
                            <span className="instruction-icon">3️⃣</span>
                            <span>Press the <strong>blue button</strong> to cast your vote</span>
                        </li>
                        <li>
                            <span className="instruction-icon">4️⃣</span>
                            <span>The <strong>red LED</strong> will light up to confirm</span>
                        </li>
                        <li>
                            <span className="instruction-icon">⚠️</span>
                            <span><strong>No changes allowed</strong> after voting</span>
                        </li>
                    </ul>
                </div>

                {/* Begin Button */}
                <motion.button
                    className="begin-button"
                    onClick={onBeginVoting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="button-text">BEGIN VOTING</span>
                    <span className="button-arrow">→</span>
                </motion.button>

                {/* Footer */}
                <div className="landing-footer">
                    <div className="seal-badge">
                        <span className="seal-dot"></span>
                        <span>Secure • Confidential • Tamper-Proof</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
