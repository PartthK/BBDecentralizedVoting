// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract DecentralizedVoting is Ownable, Pausable {
    // Structure to represent a proposal
    struct Proposal {
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool exists;
        mapping(address => bool) voted;
    }
    
    // Mapping of proposal ID to Proposal struct
    mapping(uint256 => Proposal) public proposals;
    
    // Events to emit on proposal creation and voting
    event ProposalCreated(uint256 proposalId, string description, uint256 startTime, uint256 endTime);
    event Voted(uint256 proposalId, address voter, bool inSupport);
    event VotesCounted(uint256 proposalId, uint256 forVotes, uint256 againstVotes);

    // Function to create a new proposal
    function createProposal(uint256 proposalId, string memory description, uint256 duration) public {
        require(!proposals[proposalId].exists, "Proposal already exists");
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.description = description;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + duration;
        newProposal.exists = true;
        
        emit ProposalCreated(proposalId, description, newProposal.startTime, newProposal.endTime);
    }
    
    // Function to vote for or against a proposal
    function vote(uint256 proposalId, bool inSupport) public {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.exists, "Proposal does not exist");
        require(!proposal.voted[msg.sender], "Already voted");
        require(block.timestamp >= proposal.startTime && block.timestamp <= proposal.endTime, "Voting period has ended");
        
        if (inSupport) {
            proposal.forVotes++;
        } else {
            proposal.againstVotes++;
        }
        proposal.voted[msg.sender] = true;
        
        emit Voted(proposalId, msg.sender, inSupport);
    }

    // Function to count votes for a proposal
    function countVotes(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.exists, "Proposal does not exist");
        require(block.timestamp > proposal.endTime, "Voting period has not ended yet");

        emit VotesCounted(proposalId, proposal.forVotes, proposal.againstVotes);
    }
}
