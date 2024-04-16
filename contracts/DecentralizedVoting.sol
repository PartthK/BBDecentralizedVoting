// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedVoting {
    // Structure to represent a proposal
    struct Proposal {
        string description;    // description of proposal
        uint256 forVotes;      // Number of votes in support of the proposal
        uint256 againstVotes;  // Number of votes against the proposal
        bool exists;           // Checks if the proposal exists or not
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
        // checks if the proposal already exists
        require(!proposals[proposalId].exists, "Proposal already exists");

        // creates a new proposal and initializes votes for and against to 0
        Proposal memory newProposal = Proposal(description, 0, 0, true);
        proposals[proposalId] = newProposal;
        
        emit ProposalCreated(proposalId, description);
    }
    
    // Function to vote for or against a proposal
    function vote(uint256 proposalId, bool inSupport) public {
        // ensures existence of the proposal
        require(proposals[proposalId].exists, "Proposal does not exist");

        // ensures the voter is authorized to vote
        require(voterWeights[msg.sender] > 0, "You are not authorized to vote.");
        
        Proposal storage proposal = proposals[proposalId];

        // update vote count based on whether the voter is for or against the proposal
        if (inSupport) {
            proposal.forVotes += voterWeights[msg.sender];
        } else {
            proposal.againstVotes += voterWeights[msg.sender];
        }
        
        emit Voted(proposalId, msg.sender, inSupport);
    }

    // Function to count votes for a proposal
    function countVotes(uint256 proposalId) public {
        // ensures the proposal exists
        require(proposals[proposalId].exists, "Proposal does not exist");

        Proposal storage proposal = proposals[proposalId];
        emit VotesCounted(proposalId, proposal.forVotes, proposal.againstVotes);
    }
    
    // Function to assign voting weights to voters
    function assignVotingWeight(address[] memory voters, uint256[] memory weights) public {
        // checks if the number of voters matches the number of weights assigned
        require(voters.length == weights.length, "Length mismatch");

        // iteration statement to assign voting weights to users
        for (uint256 i = 0; i < voters.length; i++) {
            // verifies if a weight is already assigned to a user or not
            require(voterWeights[voters[i]] == 0, "Voter weight already assigned");

            // assigns voting weights
            voterWeights[voters[i]] = weights[i];
        }
    }
}
