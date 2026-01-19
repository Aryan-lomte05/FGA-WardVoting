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
        description: 'State legislative assembly election across multiple constituencies',
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
        partyCodes: ['PA', 'PB', 'PC', 'PD', 'PE'],
        color: '#F59E0B'
    },

    PANCHAYAT: {
        id: 'PANCHAYAT',
        name: 'Gram Panchayat',
        description: 'Village council election with independent candidates',
        icon: '🏘️',
        wards: 3,
        wardLabel: 'Ward',
        partyCodes: ['PA', 'PB', 'PC'],
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
