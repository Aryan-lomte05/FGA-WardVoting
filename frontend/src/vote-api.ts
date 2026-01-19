import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface Candidate {
    id: string;
    name: string;
    party: string;
}

export interface ElectionResults {
    results: Record<string, number>;
    total: number;
    winner: {
        name: string;
        votes: number;
    } | null;
}

export const fetchConfig = async () => {
    try {
        const response = await axios.get(`${API_URL}/config`);
        return response.data;
    } catch (error) {
        console.error("Error fetching config:", error);
        return null;
    }
};

export const castVote = async (candidate: string) => {
    try {
        const response = await axios.post(`${API_URL}/vote`, { candidate });
        return response.data;
    } catch (error) {
        console.error("Error casting vote:", error);
        throw error;
    }
};

export const simulateVotes = async (count: number) => {
    try {
        const response = await axios.post(`${API_URL}/simulate/${count}`);
        return response.data;
    } catch (error) {
        console.error("Error simulating votes:", error);
        throw error;
    }
};

export const fetchResults = async () => {
    try {
        const response = await axios.get(`${API_URL}/results`);
        return response.data;
    } catch (error) {
        console.error("Error fetching results:", error);
        return null;
    }
};

export const resetElection = async () => {
    try {
        await axios.post(`${API_URL}/reset`);
    } catch (error) {
        console.error("Error resetting:", error);
    }
}
