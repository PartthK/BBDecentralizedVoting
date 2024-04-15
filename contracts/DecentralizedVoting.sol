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
    mapping(address => address) public delegates;
    mapping(address => uint256) public votingPower;

    event ProposalCreated(uint256 proposalId, string description);
    event Voted(uint256 proposalId, address voter, bool inSupport);
    event Delegated(address delegator, address delegate);

    function createProposal(uint256 proposalId, string memory description) public {
        require(!proposals[proposalId].exists, "Proposal already exists");

        Proposal memory newProposal = Proposal(description, 0, 0, true);
        proposals[proposalId] = newProposal;

        emit ProposalCreated(proposalId, description);
    }

    function vote(uint256 proposalId, bool inSupport) public {
        require(proposals[proposalId].exists, "Proposal does not exist");
        require(votingPower[msg.sender] > 0, "Sender has no voting power");

        Proposal storage proposal = proposals[proposalId];
        if (inSupport) {
            proposal.forVotes += votingPower[msg.sender];
        } else {
            proposal.againstVotes += votingPower[msg.sender];
        }

        emit Voted(proposalId, msg.sender, inSupport);
    }

    function delegate(address delegatee) public {
        require(msg.sender != delegatee, "Self-delegation is not allowed");

        delegates[msg.sender] = delegatee;
        emit Delegated(msg.sender, delegatee);
    }

    function totalVotes() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < proposals.length; i++) {
            Proposal storage proposal = proposals[i];
            total += proposal.forVotes + proposal.againstVotes;
        }
        return total;
    }
}
