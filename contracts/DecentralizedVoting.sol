// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedVoting {
    // Structure to represent a proposal
    struct Proposal {
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        bool exists;
        uint256 startTime;
        uint256 endTime;
        address proposer;
        bool passed;
    }
    
    // Mapping of proposal ID to Proposal struct
    mapping(uint256 => Proposal) public proposals;

    // Mapping of voter addresses to their weights
    mapping(address => uint256) public voterWeights;

    // Mapping of voter addresses to the address they delegated their vote to
    mapping(address => address) public delegatedTo;

    // Events to emit on proposal creation, voting, and delegation
    event ProposalCreated(uint256 proposalId, string description, address proposer, uint256 startTime, uint256 endTime);
    event Voted(uint256 proposalId, address voter, bool inSupport);
    event VotesCounted(uint256 proposalId, uint256 forVotes, uint256 againstVotes);
    event Delegated(address indexed delegator, address indexed delegate);

    // Contract owner
    address public owner;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    // Function to create a new proposal
    function createProposal(uint256 proposalId, string memory description, uint256 duration) public {
        require(!proposals[proposalId].exists, "Proposal already exists");
        require(duration > 0, "Duration must be greater than zero");

        Proposal memory newProposal = Proposal({
            description: description,
            forVotes: 0,
            againstVotes: 0,
            exists: true,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            proposer: msg.sender,
            passed: false
        });

        proposals[proposalId] = newProposal;

        emit ProposalCreated(proposalId, description, msg.sender, block.timestamp, block.timestamp + duration);
    }

    // Function to vote for or against a proposal
    function vote(uint256 proposalId, bool inSupport) public {
        require(proposals[proposalId].exists, "Proposal does not exist");
        require(block.timestamp < proposals[proposalId].endTime, "Voting period has ended");

        address voter = msg.sender;
        uint256 weight = getVoterWeight(voter);

        if (delegatedTo[voter] != address(0)) {
            voter = delegatedTo[voter];
            weight = getVoterWeight(voter);
        }

        Proposal storage proposal = proposals[proposalId];

        if (inSupport) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }

        emit Voted(proposalId, msg.sender, inSupport);
    }

    // Function to count votes for a proposal
    function countVotes(uint256 proposalId) public {
        require(proposals[proposalId].exists, "Proposal does not exist");
        require(block.timestamp >= proposals[proposalId].endTime, "Voting period has not ended yet");

        Proposal storage proposal = proposals[proposalId];

        if (proposal.forVotes > proposal.againstVotes) {
            proposal.passed = true;
        }

        emit VotesCounted(proposalId, proposal.forVotes, proposal.againstVotes);
    }

    // Function to assign voting weights to voters
    function assignVotingWeight(address[] memory voters, uint256[] memory weights) public onlyOwner {
        require(voters.length == weights.length, "Length mismatch");

        for (uint256 i = 0; i < voters.length; i++) {
            require(voterWeights[voters[i]] == 0, "Voter weight already assigned");
            voterWeights[voters[i]] = weights[i];
        }
    }

    // Function to delegate voting power to another address
    function delegate(address delegatee) public {
        require(delegatee != address(0), "Invalid delegate address");
        require(delegatee != msg.sender, "Cannot delegate to yourself");

        delegatedTo[msg.sender] = delegatee;

        emit Delegated(msg.sender, delegatee);
    }

    // Function to get the voting weight of a voter
    function getVoterWeight(address voter) internal view returns (uint256) {
        if (delegatedTo[voter] != address(0)) {
            return voterWeights[delegatedTo[voter]];
        }
        return voterWeights[voter];
    }

    // Function to transfer ownership of the contract
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid owner address");
        owner = newOwner;
    }
}
