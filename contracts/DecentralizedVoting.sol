// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedVoting {
    struct Voter {
        uint256 balance;
        uint256 power; // voting power
        address delegate; // address to whom they delegate their vote
    }
    
    struct Proposal {
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        bool exists;
    }
    
    mapping(address => Voter) public voters;
    mapping(uint256 => Proposal) public proposals;

    uint256 public totalVotes;
    
    event ProposalCreated(uint256 indexed proposalId, string description);
    event Voted(uint256 indexed proposalId, address voter, bool inSupport);
    event Delegated(address indexed from, address indexed to);

    function createProposal(uint256 proposalId, string memory description) public {
        require(!proposals[proposalId].exists, "Proposal already exists");
        
        proposals[proposalId] = Proposal(description, 0, 0, true);
        
        emit ProposalCreated(proposalId, description);
    }
    
    function vote(uint256 proposalId, bool inSupport) public {
        require(proposals[proposalId].exists, "Proposal does not exist");
        require(voters[msg.sender].balance > 0, "Sender has no voting power");

        Proposal storage proposal = proposals[proposalId];
        if (inSupport) {
            proposal.forVotes += voters[msg.sender].power;
        } else {
            proposal.againstVotes += voters[msg.sender].power;
        }

        voters[msg.sender].balance -= voters[msg.sender].power; // remove the power from balance
        
        emit Voted(proposalId, msg.sender, inSupport);
    }

    function delegate(address to) public {
        require(to != msg.sender, "Self-delegation is not allowed");
        
        voters[msg.sender].delegate = to;
        uint256 power = voters[msg.sender].power;
        voters[to].power += power; // add the delegated power to delegate's power
        voters[msg.sender].power = 0; // reset sender's power
        
        // Update total votes
        totalVotes += power;

        emit Delegated(msg.sender, to);
    }
}
