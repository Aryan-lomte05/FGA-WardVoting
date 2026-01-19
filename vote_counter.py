import random
from collections import Counter

def run_evm_simulation():
    """
    Simulates an Electronic Voting Machine (EVM) counter.
    - 5 Parties
    - 4 Candidates per party
    - NOTA option
    - 1000 Voters casting random votes
    """
    
    # 1. Setup Parties and Candidates
    parties = ["Party A", "Party B", "Party C", "Party D", "Party E"]
    candidates = []
    
    # Generate candidates structure
    # Mapping to keep track of which candidate belongs to which party
    candidate_party_map = {} 
    
    for party in parties:
        for i in range(1, 5):
            candidate_name = f"{party} - Candidate {i}"
            candidates.append(candidate_name)
            candidate_party_map[candidate_name] = party
            
    # Add NOTA to the list of choices
    choices = candidates + ["NOTA"]
    
    print("--- EVM SIMULATION INITIALIZED ---")
    print(f"Total Parties: {len(parties)}")
    print(f"Candidates per Party: 4")
    print("Option Included: NOTA")
    print("Total Voters registered: 1000")
    print("----------------------------------\n")
    
    # 2. Simulate Voting
    # 1000 voters, random choice
    print("Voting in progress...")
    votes = []
    for _ in range(1000):
        # Every person chooses 1 candidate at a time
        vote = random.choice(choices)
        votes.append(vote)
        
    print("Voting completed successfully on all systems.\n")
    
    # 3. Count Results
    results = Counter(votes)
    
    # 4. Display Results
    print("==================================")
    print("         ELECTION RESULTS         ")
    print("==================================\n")
    
    # Print results grouped by Party
    total_valid_votes = 0 # Excluding NOTA maybe? Or just count structure? usually NOTA is valid vote.
    
    for party in parties:
        print(f"--- {party} ---")
        party_total = 0
        for i in range(1, 5):
            cand_name = f"{party} - Candidate {i}"
            count = results[cand_name]
            party_total += count
            print(f"  {cand_name}: {count}")
        print(f"  [Total {party} Votes]: {party_total}\n")
        
    print(f"--- NOTA ---")
    print(f"  Votes: {results['NOTA']}\n")
    
    # Determine the Winner (Person or NOTA)
    # most_common(1) returns a list of (element, count) tuples
    winner_name, winner_votes = results.most_common(1)[0]
    
    print("==================================")
    print(f"FINAL VERDICT: The winner is '{winner_name}' with {winner_votes} votes!")
    print("==================================")

if __name__ == "__main__":
    run_evm_simulation()
