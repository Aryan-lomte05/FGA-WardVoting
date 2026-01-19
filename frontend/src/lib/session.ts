// Session Management for Vote Integrity with Voter Tracking
// Prevents duplicate voting and tracks voter numbers

export interface VotingSession {
    sessionId: string;
    voterNumber: number; // Sequential voter number (1, 2, 3...)
    hasVoted: boolean;
    currentWard: number;
    votes: Record<number, string>; // wardNumber -> candidateId
    deviceFingerprint: string;
    createdAt: number;
    completedAt?: number;
}

// Generate unique session ID
export const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create device fingerprint (simple hash of browser characteristics)
export const getDeviceFingerprint = (): string => {
    const ua = navigator.userAgent;
    const screen = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;

    const fingerprint = `${ua}|${screen}|${timezone}|${language}`;

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return `fp_${Math.abs(hash).toString(36)}`;
};

// Get next voter number by counting completed sessions
const getNextVoterNumber = (): number => {
    let count = 0;

    // Count all completed voting sessions in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('voting_session_')) {
            count++;
        }
    }

    return count + 1;
};

// Initialize or retrieve session
export const initializeSession = (): VotingSession => {
    const stored = localStorage.getItem('voting_session');

    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            // Invalid session, create new
        }
    }

    const voterNumber = getNextVoterNumber();

    const newSession: VotingSession = {
        sessionId: generateSessionId(),
        voterNumber: voterNumber,
        hasVoted: false,
        currentWard: 1,
        votes: {},
        deviceFingerprint: getDeviceFingerprint(),
        createdAt: Date.now()
    };

    saveSession(newSession);
    return newSession;
};

// Save session to localStorage
export const saveSession = (session: VotingSession): void => {
    localStorage.setItem('voting_session', JSON.stringify(session));
};

// Record a vote for a ward
export const recordVote = (session: VotingSession, wardNumber: number, candidateId: string, totalWards: number): VotingSession => {
    const updated: VotingSession = {
        ...session,
        votes: {
            ...session.votes,
            [wardNumber]: candidateId
        },
        currentWard: wardNumber < totalWards ? wardNumber + 1 : wardNumber
    };

    // Check if all wards are complete
    if (Object.keys(updated.votes).length === totalWards) {
        updated.hasVoted = true;
        updated.completedAt = Date.now();

        // Save completed session with voter number for tracking
        localStorage.setItem(`voting_session_${updated.voterNumber}`, JSON.stringify(updated));
    }

    saveSession(updated);
    return updated;
};

// Clear session (for testing or next voter in single-device mode)
export const clearSession = (): void => {
    localStorage.removeItem('voting_session');
};

// Check if session has already voted
export const hasAlreadyVoted = (session: VotingSession): boolean => {
    return session.hasVoted;
};

// Get all completed sessions for admin view
export const getAllVoterSessions = (): VotingSession[] => {
    const sessions: VotingSession[] = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('voting_session_')) {
            try {
                const session = JSON.parse(localStorage.getItem(key) || '{}');
                if (session.hasVoted) {
                    sessions.push(session);
                }
            } catch {
                // Skip invalid sessions
            }
        }
    }

    // Sort by voter number
    return sessions.sort((a, b) => a.voterNumber - b.voterNumber);
};

// Clear all votes (New Election feature)
export const clearAllVotes = (): void => {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('voting_session')) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
};
