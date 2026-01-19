# 🗳️ EVM Voting System

A world-class digital Electronic Voting Machine (EVM) that exactly replicates the Indian EVM ballot unit design. Built for academic competitions with institutional precision.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![PWA](https://img.shields.io/badge/PWA-Enabled-purple)

---

## ✨ Features

- 🎯 **Pixel-Perfect EVM Replica** - Exact match to real Indian ballot units with LED feedback.
- ⚙️ **Dynamic Configuration** - create elections with **20+ Real Political Parties** (BJP, INC, AAP, etc.).
- 🔒 **Vote Integrity** - Session locking, refresh protection, device fingerprinting, and no duplicate votes.
- 📊 **Admin Panel** - Passcode-protected dashboard with real-time counting and winner declaration.
- 📱 **PWA Ready** - Installable app for Mobile & Desktop with offline support.
- ⚡ **Lightning Fast** - Optimized performance (<1s load time).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🎨 Dynamic Election Setup (New!)

**No Coing Required!** Configure your election directly from the UI.

### 📋 Election Presets
Choose from instant setups:
- **Major Problem Statement**: The classic project scenario (4 Wards, Default Parties).
- **Lok Sabha (National)**: Simulated national election with major parties.
- **State Assembly**: Regional election setups.
- **College/School**: Simple student elections.

### ⚙️ Custom Configuration
Create your own scenario:
1. **Name**: Give your election a title.
2. **Wards**: Set any number of wards (1 to 50).
3. **Parties**: Select from our **Comprehensive Party Library**.
   - **National**: BJP, INC, AAP, BSP, CPI, CPI(M), NCP
   - **State**: SP, TMC, DMK, AIADMK, Shiv Sena, YSRCP, BRS, and many more.

---

## 📖 Usage Guide

### 🗳️ Voting Flow
1. **Landing**: User clicks "Begin Voting".
2. **Cast Vote**: Press the Blue Button next to candidate. Red LED glows.
3. **Transition**: System auto-advances to the next ward after a beep.
4. **Completion**: "Vote Recorded" screen appears.
5. **Next Voter**: Admin clicks "Start New Session" (resets state for next person).

### 👨‍💼 Admin Panel
**URL**: `/admin`
**Passcode**: `12345`

- View live results per ward.
- See winner declarations.
- **Reset System**: Button to clear all votes and re-configure election.

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── BallotUnit.tsx       # The main EVM interface
│   ├── ElectionSetup.tsx    # Configuration screen
│   ├── AdminPanel.tsx       # Results dashboard
│   └── ...
├── data/
│   ├── candidates.ts        # Party Library (Symbols, Colors)
│   └── electionPresets.ts   # Pre-defined election types
├── lib/
│   └── session.ts           # Storage & Session Logic
└── App.tsx                  # Main Router & State
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Install CLI**: `npm install -g vercel`
2. **Deploy**:
   ```bash
   vercel --prod
   ```

### PWA Installation
- **Mobile**: Open in Chrome/Safari -> "Add to Home Screen".
- **Desktop**: Click the "Install App" icon in the address bar.

---

## 🔒 Security
- **Immutable Storage**: Votes cannot be changed once cast.
- **Session Locking**: Prevents re-voting in the same session.
- **Refresh Guard**: Resumes progress if refreshed mid-vote.

---

**Built with ❤️ for FGA Project**
