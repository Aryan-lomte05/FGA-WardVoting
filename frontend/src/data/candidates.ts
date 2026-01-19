// Comprehensive Party Library - Real Indian Political Parties + Custom Options
// Updated for dynamic election configuration

export interface Party {
    code: string;
    name: string;
    fullName: string;
    symbol: string;
    color: string;
    type: 'national' | 'state' | 'regional' | 'custom';
}

export interface Candidate {
    id: string;
    wardNumber: number;
    partyCode: string;
    candidateName: string;
    serialNumber: number;
}

// Real Indian Political Parties with Actual Symbols
export const PARTY_LIBRARY: Record<string, Party> = {
    // National Parties
    BJP: {
        code: 'BJP',
        name: 'BJP',
        fullName: 'Bharatiya Janata Party',
        symbol: '🪷', // Lotus
        color: '#FF9933',
        type: 'national'
    },
    INC: {
        code: 'INC',
        name: 'Congress',
        fullName: 'Indian National Congress',
        symbol: '✋', // Hand
        color: '#138808',
        type: 'national'
    },
    AAP: {
        code: 'AAP',
        name: 'AAP',
        fullName: 'Aam Aadmi Party',
        symbol: '🧹', // Broom
        color: '#0066CC',
        type: 'national'
    },
    BSP: {
        code: 'BSP',
        name: 'BSP',
        fullName: 'Bahujan Samaj Party',
        symbol: '🐘', // Elephant
        color: '#000080',
        type: 'national'
    },
    CPI: {
        code: 'CPI',
        name: 'CPI',
        fullName: 'Communist Party of India',
        symbol: '🌾', // Corn & Sickle
        color: '#FF0000',
        type: 'national'
    },
    CPIM: {
        code: 'CPIM',
        name: 'CPI(M)',
        fullName: 'Communist Party of India (Marxist)',
        symbol: '⚒️', // Hammer & Sickle
        color: '#CC0000',
        type: 'national'
    },
    NCP: {
        code: 'NCP',
        name: 'NCP',
        fullName: 'Nationalist Congress Party',
        symbol: '⏰', // Clock
        color: '#00BFFF',
        type: 'national'
    },

    // State/Regional Parties
    SP: {
        code: 'SP',
        name: 'SP',
        fullName: 'Samajwadi Party',
        symbol: '🚲', // Bicycle
        color: '#FF2222',
        type: 'state'
    },
    TMC: {
        code: 'TMC',
        name: 'TMC',
        fullName: 'All India Trinamool Congress',
        symbol: '🌸', // Trinamool Flower
        color: '#20C6A5',
        type: 'state'
    },
    DMK: {
        code: 'DMK',
        name: 'DMK',
        fullName: 'Dravida Munnetra Kazhagam',
        symbol: '🌅', // Rising Sun
        color: '#FF0000',
        type: 'state'
    },
    AIADMK: {
        code: 'AIADMK',
        name: 'AIADMK',
        fullName: 'All India Anna Dravida Munnetra Kazhagam',
        symbol: '🍃', // Two Leaves
        color: '#006400',
        type: 'state'
    },
    SS: {
        code: 'SS',
        name: 'Shiv Sena',
        fullName: 'Shiv Sena',
        symbol: '🏹', // Bow & Arrow
        color: '#FF6600',
        type: 'state'
    },
    RJD: {
        code: 'RJD',
        name: 'RJD',
        fullName: 'Rashtriya Janata Dal',
        symbol: '🏮', // Lantern
        color: '#006400',
        type: 'state'
    },
    JDU: {
        code: 'JDU',
        name: 'JD(U)',
        fullName: 'Janata Dal (United)',
        symbol: '↗️', // Arrow
        color: '#138808',
        type: 'state'
    },
    BJD: {
        code: 'BJD',
        name: 'BJD',
        fullName: 'Biju Janata Dal',
        symbol: '🐚', // Conch
        color: '#006400',
        type: 'state'
    },
    TRS: {
        code: 'TRS',
        name: 'BRS',
        fullName: 'Bharat Rashtra Samithi',
        symbol: '🚗', // Car
        color: '#FF1493',
        type: 'state'
    },
    YSRCP: {
        code: 'YSRCP',
        name: 'YSRCP',
        fullName: 'YSR Congress Party',
        symbol: '🏠', // House
        color: '#1E90FF',
        type: 'state'
    },
    TDP: {
        code: 'TDP',
        name: 'TDP',
        fullName: 'Telugu Desam Party',
        symbol: '🚲', // Bicycle (alternate)
        color: '#FFFF00',
        type: 'state'
    },
    SAD: {
        code: 'SAD',
        name: 'SAD',
        fullName: 'Shiromani Akali Dal',
        symbol: '⚖️', // Scale
        color: '#000080',
        type: 'state'
    },
    NC: {
        code: 'NC',
        name: 'NC',
        fullName: 'Jammu & Kashmir National Conference',
        symbol: '🚜', // Plough
        color: '#FF0000',
        type: 'state'
    },
    AIMIM: {
        code: 'AIMIM',
        name: 'AIMIM',
        fullName: 'All India Majlis-e-Ittehadul Muslimeen',
        symbol: '🪁', // Kite
        color: '#006400',
        type: 'regional'
    },

    // Generic Custom Parties (for Municipal/Local)
    PA: {
        code: 'PA',
        name: 'Party A',
        fullName: 'Independent Party A',
        symbol: '⭐',
        color: '#7C3AED',
        type: 'custom'
    },
    PB: {
        code: 'PB',
        name: 'Party B',
        fullName: 'Independent Party B',
        symbol: '🌟',
        color: '#EC4899',
        type: 'custom'
    },
    PC: {
        code: 'PC',
        name: 'Party C',
        fullName: 'Independent Party C',
        symbol: '💫',
        color: '#F59E0B',
        type: 'custom'
    },
    PD: {
        code: 'PD',
        name: 'Party D',
        fullName: 'Independent Party D',
        symbol: '✨',
        color: '#10B981',
        type: 'custom'
    },
    PE: {
        code: 'PE',
        name: 'Party E',
        fullName: 'Independent Party E',
        symbol: '🔆',
        color: '#3B82F6',
        type: 'custom'
    }
};

// For backward compatibility - current default parties
export const PARTIES = {
    PA: PARTY_LIBRARY.PA,
    PB: PARTY_LIBRARY.PB,
    PC: PARTY_LIBRARY.PC,
    PD: PARTY_LIBRARY.PD,
    PE: PARTY_LIBRARY.PE
};

// Generate candidates dynamically based on configuration
export const generateCandidates = (
    wards: number,
    partyCodes: string[]
): Candidate[] => {
    const candidates: Candidate[] = [];

    for (let ward = 1; ward <= wards; ward++) {
        partyCodes.forEach((partyCode, index) => {
            candidates.push({
                id: `W${ward}_${partyCode}`,
                wardNumber: ward,
                partyCode: partyCode,
                candidateName: `Candidate ${String.fromCharCode(65 + index)}${ward}`,
                serialNumber: index + 1
            });
        });
    }

    return candidates;
};

// Get candidates for a specific ward
export const getCandidatesForWard = (
    wardNumber: number,
    allCandidates: Candidate[]
): Candidate[] => {
    return allCandidates
        .filter(c => c.wardNumber === wardNumber)
        .sort((a, b) => a.serialNumber - b.serialNumber);
};

// Default configuration (Municipal Corporation)
export const DEFAULT_CANDIDATES = generateCandidates(4, ['PA', 'PB', 'PC', 'PD', 'PE']);
export const CANDIDATES = DEFAULT_CANDIDATES;
