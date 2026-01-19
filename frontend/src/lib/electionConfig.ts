// Election Configuration Management

import { generateCandidates, PARTY_LIBRARY } from '../data/candidates';
import type { Candidate } from '../data/candidates';

export interface ElectionConfig {
    id: string;
    name: string;
    wards: number;
    wardLabel: string; // "Ward", "Constituency", "Seat"
    partyCodes: string[];
    candidates: Candidate[];
    createdAt: number;
}

const CONFIG_STORAGE_KEY = 'election_config';

// Save configuration to localStorage
export const saveElectionConfig = (config: ElectionConfig): void => {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
};

// Load configuration from localStorage
export const loadElectionConfig = (): ElectionConfig | null => {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!stored) return null;

    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
};

// Create configuration from preset or custom settings
export const createElectionConfig = (
    name: string,
    wards: number,
    wardLabel: string,
    partyCodes: string[]
): ElectionConfig => {
    const candidates = generateCandidates(wards, partyCodes);

    return {
        id: `election_${Date.now()}`,
        name,
        wards,
        wardLabel,
        partyCodes,
        candidates,
        createdAt: Date.now()
    };
};

// Validate configuration
export const validateConfig = (config: ElectionConfig): boolean => {
    if (!config.name || config.wards < 1 || config.wards > 50) return false;
    if (config.partyCodes.length < 2 || config.partyCodes.length > 20) return false;

    // Check all parties exist
    for (const code of config.partyCodes) {
        if (!PARTY_LIBRARY[code]) return false;
    }

    return true;
};

// Clear configuration (for new election)
export const clearElectionConfig = (): void => {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
};

// Get default configuration (Municipal Corporation)
export const getDefaultConfig = (): ElectionConfig => {
    return createElectionConfig(
        'Municipal Corporation',
        4,
        'Ward',
        ['PA', 'PB', 'PC', 'PD', 'PE']
    );
};
