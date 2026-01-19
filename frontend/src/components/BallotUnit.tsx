import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PARTIES } from '../data/candidates';
import type { Candidate, Party } from '../data/candidates';
import { playClickSound } from '../lib/audio';
import './BallotUnit.css';

interface BallotUnitProps {
    candidates: Candidate[];
    wardNumber: number;
    wardLabel?: string;
    onVoteCast: (candidateId: string) => void;
    disabled?: boolean;
    parties?: Record<string, Party>;
}

export const BallotUnit: React.FC<BallotUnitProps> = ({
    candidates,
    wardNumber,
    wardLabel = 'Ward',
    onVoteCast,
    disabled = false,
    parties = PARTIES
}) => {
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleVote = async (candidateId: string) => {
        if (disabled || isProcessing || selectedCandidate) return;

        // Play click sound
        playClickSound();

        // Set selected candidate (lights up LED)
        setSelectedCandidate(candidateId);
        setIsProcessing(true);

        // Simulate mechanical delay (like real EVM)
        await new Promise(resolve => setTimeout(resolve, 800));

        // Notify parent
        onVoteCast(candidateId);
    };

    return (
        <div className="ballot-unit">
            {/* Header */}
            <div className="ballot-header">
                <div className="eci-badge">
                    <div className="eci-emblem">⚡</div>
                    <div className="eci-text">Aryan's EVM</div>
                </div>
            </div>

            {/* Ward Title */}
            <div className="ward-title">
                <span className="ward-label">{wardLabel.toUpperCase()} {wardNumber}</span>
            </div>

            {/* Candidate List */}
            <div className="candidate-list">
                {candidates.map((candidate) => {
                    // Force type assertion since we know the structure matches
                    const party = (parties as Record<string, Party>)[candidate.partyCode];
                    const isSelected = selectedCandidate === candidate.id;

                    return (
                        <div
                            key={candidate.id}
                            className={`candidate-row ${isSelected ? 'selected' : ''}`}
                        >
                            {/* Serial Number */}
                            <div className="serial-number">{candidate.serialNumber}</div>

                            {/* Candidate Name */}
                            <div className="candidate-info">
                                <div className="candidate-name">{candidate.candidateName}</div>
                            </div>

                            {/* Party Symbol */}
                            <div className="party-symbol-container">
                                <div className="party-symbol" style={{ borderColor: party.color }}>
                                    <span className="symbol-icon">{party.symbol}</span>
                                </div>
                                <div className="party-name">{party.name}</div>
                            </div>

                            {/* LED and Button Column */}
                            <div className="vote-controls">
                                {/* Red LED Indicator */}
                                <motion.div
                                    className={`led-indicator ${isSelected ? 'led-active' : ''}`}
                                    animate={isSelected ? {
                                        boxShadow: [
                                            '0 0 5px #ff0000',
                                            '0 0 20px #ff0000',
                                            '0 0 5px #ff0000'
                                        ]
                                    } : {}}
                                    transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0 }}
                                />

                                {/* Blue Vote Button */}
                                <motion.button
                                    className="vote-button"
                                    onClick={() => handleVote(candidate.id)}
                                    disabled={disabled || isProcessing || selectedCandidate !== null}
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: selectedCandidate ? 1 : 1.02 }}
                                >
                                    <div className="button-inner" />
                                </motion.button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="ballot-footer">
                <div className="seal-indicator">
                    <span className="seal-dot"></span>
                    <span className="seal-text">SEALED</span>
                </div>
            </div>
        </div>
    );
};
