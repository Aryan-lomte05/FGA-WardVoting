import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ELECTION_PRESETS, getAllPresets } from '../data/electionPresets';
import { PARTY_LIBRARY } from '../data/candidates';
import { createElectionConfig, type ElectionConfig } from '../lib/electionConfig';
import { Loader } from './Loader';
import './ElectionSetup.css';

interface ElectionSetupProps {
    onComplete: (config: ElectionConfig) => void;
}

export const ElectionSetup: React.FC<ElectionSetupProps> = ({ onComplete }) => {
    // Keep the loader!
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState<'preset' | 'custom'>('preset');

    // Custom configuration state
    const [customName, setCustomName] = useState('');
    const [customWards, setCustomWards] = useState(4);
    const [customWardLabel, setCustomWardLabel] = useState('Ward');
    const [selectedParties, setSelectedParties] = useState<string[]>([]);

    const handleLoaderComplete = () => {
        setIsLoading(false);
    };

    const handlePresetSelect = (presetId: string) => {
        const preset = ELECTION_PRESETS[presetId];
        if (!preset) return;

        const config = createElectionConfig(
            preset.name,
            preset.wards,
            preset.wardLabel,
            preset.partyCodes
        );

        onComplete(config);
    };

    const handleCustomSubmit = () => {
        if (!customName || selectedParties.length < 2) {
            alert('Please enter election name and select at least 2 parties');
            return;
        }

        const config = createElectionConfig(
            customName,
            customWards,
            customWardLabel,
            selectedParties
        );

        onComplete(config);
    };

    const toggleParty = (partyCode: string) => {
        if (selectedParties.includes(partyCode)) {
            setSelectedParties(selectedParties.filter(p => p !== partyCode));
        } else {
            if (selectedParties.length < 20) {
                setSelectedParties([...selectedParties, partyCode]);
            }
        }
    };

    if (isLoading) {
        return <Loader onComplete={handleLoaderComplete} />;
    }

    const presets = getAllPresets();
    const nationalParties = Object.values(PARTY_LIBRARY).filter(p => p.type === 'national');
    const stateParties = Object.values(PARTY_LIBRARY).filter(p => p.type === 'state');
    const customParties = Object.values(PARTY_LIBRARY).filter(p => p.type === 'custom');

    return (
        <div className="election-setup">
            <div className="setup-container">
                {/* Header */}
                <motion.div
                    className="setup-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="setup-logo">⚡</div>
                    <h1>Aryan's EVM</h1>
                    <p>Configure Your Election</p>
                </motion.div>

                {/* Tab Selection */}
                <div className="setup-tabs">
                    <button
                        className={`setup-tab ${step === 'preset' ? 'active' : ''}`}
                        onClick={() => setStep('preset')}
                    >
                        <span>📋</span>
                        <span>Presets</span>
                    </button>
                    <button
                        className={`setup-tab ${step === 'custom' ? 'active' : ''}`}
                        onClick={() => setStep('custom')}
                    >
                        <span>⚙️</span>
                        <span>Custom</span>
                    </button>
                </div>

                {/* Preset Selection */}
                {step === 'preset' && (
                    <motion.div
                        className="preset-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {presets.map((preset, index) => (
                            <motion.div
                                key={preset.id}
                                className={`preset-card ${preset.id === 'STANDARD_PROJECT' ? 'featured-preset' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handlePresetSelect(preset.id)}
                                style={{ borderColor: preset.color }}
                            >
                                <div className="preset-icon">{preset.icon}</div>
                                <h3>{preset.name}</h3>
                                <p>{preset.description}</p>
                                <div className="preset-details">
                                    <span>{preset.wards} {preset.wardLabel}{preset.wards > 1 ? 's' : ''}</span>
                                    <span>•</span>
                                    <span>{preset.partyCodes.length} Parties</span>
                                </div>
                                <button className="preset-select-btn" style={{ background: preset.color }}>
                                    Start Election
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Custom Configuration */}
                {step === 'custom' && (
                    <motion.div
                        className="custom-config"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="config-section">
                            <label>Election Name</label>
                            <input
                                type="text"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                placeholder="e.g., College Election 2024"
                                className="config-input"
                            />
                        </div>

                        <div className="config-row">
                            <div className="config-section">
                                <label>Number of {customWardLabel}s</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={customWards}
                                    onChange={(e) => setCustomWards(parseInt(e.target.value) || 1)}
                                    className="config-input"
                                />
                            </div>

                            <div className="config-section">
                                <label>Label</label>
                                <select
                                    value={customWardLabel}
                                    onChange={(e) => setCustomWardLabel(e.target.value)}
                                    className="config-input"
                                >
                                    <option value="Ward">Ward</option>
                                    <option value="Constituency">Constituency</option>
                                    <option value="Seat">Seat</option>
                                    <option value="Division">Division</option>
                                </select>
                            </div>
                        </div>

                        <div className="config-section">
                            <label>Select Parties ({selectedParties.length}/20)</label>

                            {/* National Parties */}
                            <div className="party-category">
                                <h4>National Parties</h4>
                                <div className="party-grid">
                                    {nationalParties.map(party => (
                                        <div
                                            key={party.code}
                                            className={`party-card ${selectedParties.includes(party.code) ? 'selected' : ''}`}
                                            onClick={() => toggleParty(party.code)}
                                            style={{ borderColor: party.color }}
                                        >
                                            <div className="party-symbol">{party.symbol}</div>
                                            <div className="party-name">{party.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* State Parties */}
                            <div className="party-category">
                                <h4>State & Regional Parties</h4>
                                <div className="party-grid">
                                    {stateParties.map(party => (
                                        <div
                                            key={party.code}
                                            className={`party-card ${selectedParties.includes(party.code) ? 'selected' : ''}`}
                                            onClick={() => toggleParty(party.code)}
                                            style={{ borderColor: party.color }}
                                        >
                                            <div className="party-symbol">{party.symbol}</div>
                                            <div className="party-name">{party.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Parties */}
                            <div className="party-category">
                                <h4>Independent/Custom</h4>
                                <div className="party-grid">
                                    {customParties.map(party => (
                                        <div
                                            key={party.code}
                                            className={`party-card ${selectedParties.includes(party.code) ? 'selected' : ''}`}
                                            onClick={() => toggleParty(party.code)}
                                            style={{ borderColor: party.color }}
                                        >
                                            <div className="party-symbol">{party.symbol}</div>
                                            <div className="party-name">{party.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            className="custom-submit-btn"
                            onClick={handleCustomSubmit}
                            disabled={!customName || selectedParties.length < 2}
                        >
                            Create Election
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
