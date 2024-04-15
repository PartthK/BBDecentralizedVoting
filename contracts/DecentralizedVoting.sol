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

    // Mapping of voter addresses to their weights
    mapping(address => uint256) public voterWeights;
    
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
        require(voterWeights[msg.sender] > 0, "You are not authorized to vote.");
        
        Proposal storage proposal = proposals[proposalId];
        if (inSupport) {
            proposal.forVotes += voterWeights[msg.sender];
        } else {
            proposal.againstVotes += voterWeights[msg.sender];
        }
        
        emit Voted(proposalId, msg.sender, inSupport);
    }

    // Function to count votes for a proposal
    function countVotes(uint256 proposalId) public {
        require(proposals[proposalId].exists, "Proposal does not exist");

        Proposal storage proposal = proposals[proposalId];
        emit VotesCounted(proposalId, proposal.forVotes, proposal.againstVotes);
    }
    
    // Function to assign voting weights to voters
    function assignVotingWeight(address[] memory voters, uint256[] memory weights) public {
        require(voters.length == weights.length, "Length mismatch");
        
        for (uint256 i = 0; i < voters.length; i++) {
            require(voterWeights[voters[i]] == 0, "Voter weight already assigned");
            voterWeights[voters[i]] = weights[i];
        }
    }
}
