// Party and Candidate Data Structure
// Matching real EVM ballot unit design

export interface Party {
    code: string;
    name: string;
    symbol: string; // Emoji representation
    color: string;
}

export interface Candidate {
    id: string;
    wardNumber: number;
    partyCode: string;
    candidateName: string;
    serialNumber: number; // Position in ward (1-5)
}

// 5 Political Parties
export const PARTIES: Record<string, Party> = {
    PA: {
        code: 'PA',
        name: 'Party A',
        symbol: '🪷', // Lotus
        color: '#FF9933'
    },
    PB: {
        code: 'PB',
        name: 'Party B',
        symbol: '✋', // Hand
        color: '#138808'
    },
    PC: {
        code: 'PC',
        name: 'Party C',
        symbol: '☸️', // Wheel
        color: '#000080'
    },
    PD: {
        code: 'PD',
        name: 'Party D',
        symbol: '🦁', // Lion
        color: '#FF6B35'
    },
    PE: {
        code: 'PE',
        name: 'Party E',
        symbol: '⭐', // Star
        color: '#9C27B0'
    }
};

// Generate candidates for all 4 wards
// Each ward has 5 candidates (one from each party)
export const generateCandidates = (): Candidate[] => {
    const candidates: Candidate[] = [];
    const partyCodes = Object.keys(PARTIES);

    for (let ward = 1; ward <= 4; ward++) {
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

export const CANDIDATES = generateCandidates();

// Get candidates for a specific ward
export const getCandidatesForWard = (wardNumber: number): Candidate[] => {
    return CANDIDATES.filter(c => c.wardNumber === wardNumber)
        .sort((a, b) => a.serialNumber - b.serialNumber);
};
