// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedVoting {
    struct Proposal {
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        bool exists;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalIdCounter;

    event ProposalCreated(uint256 proposalId, string description);
    event Voted(uint256 proposalId, address voter, bool inSupport);

    function createProposal(uint256 proposalId, string memory description) public {
        require(!proposals[proposalId].exists, "Proposal already exists");

        Proposal memory newProposal = Proposal(description, 0, 0, true);
        proposals[proposalId] = newProposal;
        
        // Increment proposalIdCounter
        proposalIdCounter++;

        emit ProposalCreated(proposalId, description);
    }

    function vote(uint256 proposalId, bool inSupport) public {
        require(proposals[proposalId].exists, "Proposal does not exist");

        Proposal storage proposal = proposals[proposalId];
        if (inSupport) {
            proposal.forVotes++;
        } else {
            proposal.againstVotes++;
        }

        emit Voted(proposalId, msg.sender, inSupport);
    }

    function totalVotes() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 1; i <= proposalIdCounter; i++) {
            Proposal storage proposal = proposals[i];
            total += proposal.forVotes + proposal.againstVotes;
        }
        return total;
    }
}
