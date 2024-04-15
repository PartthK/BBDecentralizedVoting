// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedVoting {
    // Structure to represent a proposal
    struct Proposal {
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        bool exists;
    }
    
    // Mapping of proposal ID to Proposal struct
    mapping(uint256 => Proposal) public proposals;
    
    // Events to emit on proposal creation and voting
    event ProposalCreated(uint256 proposalId, string description);
    event Voted(uint256 proposalId, address voter, bool inSupport);
    event VotesCounted(uint256 proposalId, uint256 forVotes, uint256 againstVotes);

    // Function to create a new proposal
    function createProposal(uint256 proposalId, string memory description) public {
        require(!proposals[proposalId].exists, "Proposal already exists");
        
        Proposal memory newProposal = Proposal(description, 0, 0, true);
        proposals[proposalId] = newProposal;
        
        emit ProposalCreated(proposalId, description);
    }
    
    // Function to vote for or against a proposal
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

    // Function to count votes for a proposal
    function countVotes(uint256 proposalId) public {
        require(proposals[proposalId].exists, "Proposal does not exist");

        Proposal storage proposal = proposals[proposalId];
        emit VotesCounted(proposalId, proposal.forVotes, proposal.againstVotes);
    }
}
