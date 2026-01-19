// Election Presets - Pre-configured election types

export interface ElectionPreset {
    id: string;
    name: string;
    description: string;
    icon: string;
    wards: number;
    wardLabel: string; // "Ward", "Constituency", "Seat"
    partyCodes: string[];
    color: string;
}

export const ELECTION_PRESETS: Record<string, ElectionPreset> = {
    STANDARD_PROJECT: {
        id: 'STANDARD_PROJECT',
        name: 'Dinesh Sir Problem Statement',
        description: 'Standard Project - 4 Wards, 5 Major Parties',
        icon: '🚀',
        wards: 4,
        wardLabel: 'Ward',
        partyCodes: ['BJP', 'INC', 'AAP', 'BSP', 'SP'],
        color: '#3B82F6'
    },

    LOK_SABHA: {
        id: 'LOK_SABHA',
        name: 'Lok Sabha Election',
        description: 'National parliamentary election with major political parties',
        icon: '🏛️',
        wards: 1,
        wardLabel: 'Constituency',
        partyCodes: ['BJP', 'INC', 'AAP', 'BSP', 'CPIM'],
        color: '#7C3AED'
    },

    STATE_ASSEMBLY: {
        id: 'STATE_ASSEMBLY',
        name: 'State Assembly Election',
        description: 'State legislative assembly election',
        icon: '🏢',
        wards: 5,
        wardLabel: 'Constituency',
        partyCodes: ['BJP', 'INC', 'AAP', 'BSP'],
        color: '#EC4899'
    },

    MUNICIPAL: {
        id: 'MUNICIPAL',
        name: 'Municipal Corporation',
        description: 'Local body election with ward-wise voting',
        icon: '🏙️',
        wards: 4,
        wardLabel: 'Ward',
        partyCodes: ['BJP', 'INC', 'AAP', 'BSP', 'YZP'],
        color: '#F59E0B'
    },

    PANCHAYAT: {
        id: 'PANCHAYAT',
        name: 'Gram Panchayat',
        description: 'Village council election',
        icon: '🏘️',
        wards: 3,
        wardLabel: 'Ward',
        partyCodes: ['IND1', 'IND2', 'IND3'],
        color: '#10B981'
    }
};

// Get preset by ID
export const getPreset = (id: string): ElectionPreset | null => {
    return ELECTION_PRESETS[id] || null;
};

// Get all presets as array
export const getAllPresets = (): ElectionPreset[] => {
    return Object.values(ELECTION_PRESETS);
};
