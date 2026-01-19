// Session Management for Vote Integrity
// Prevents duplicate voting and handles device fingerprinting

export interface VotingSession {
    sessionId: string;
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

    const newSession: VotingSession = {
        sessionId: generateSessionId(),
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
export const recordVote = (session: VotingSession, wardNumber: number, candidateId: string): VotingSession => {
    const updated: VotingSession = {
        ...session,
        votes: {
            ...session.votes,
            [wardNumber]: candidateId
        },
        currentWard: wardNumber < 4 ? wardNumber + 1 : wardNumber
    };

    // Check if all wards are complete
    if (Object.keys(updated.votes).length === 4) {
        updated.hasVoted = true;
        updated.completedAt = Date.now();
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
