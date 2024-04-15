const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("DecentralizedVoting", function () {
  let DecentralizedVoting;
  let decentralizedVoting;
  let owner;
  let voter1;
  let voter2;
  let voter3;

  beforeEach(async function () {
    [owner, voter1, voter2, voter3] = await ethers.getSigners();
    DecentralizedVoting = await ethers.getContractFactory("DecentralizedVoting");
    decentralizedVoting = await DecentralizedVoting.deploy();
  });

  describe("Create a proposal", function () {
    it("Should create a new proposal", async function () {
      await decentralizedVoting.createProposal(1, "Test Proposal");
      const proposal = await decentralizedVoting.proposals(1);

      expect(proposal.description).to.equal("Test Proposal");
      expect(proposal.exists).to.equal(true);
    });
  });

  describe("Vote on a proposal", function () {
    it("Should allow voting on a proposal", async function () {
      await decentralizedVoting.createProposal(1, "Test Proposal");
      
      await decentralizedVoting.vote(1, true);
      const proposal1 = await decentralizedVoting.proposals(1);

      expect(proposal1.forVotes).to.equal(1);

      await decentralizedVoting.vote(1, false);
      const proposal2 = await decentralizedVoting.proposals(1);

      expect(proposal2.againstVotes).to.equal(1);
    });
  });

  describe("Delegate votes", function () {
    it("Should allow voters to delegate their votes", async function () {
      await decentralizedVoting.delegate(voter2.address);

      await decentralizedVoting.createProposal(1, "Test Proposal");
      await decentralizedVoting.connect(voter1).vote(1, true);

      const proposal = await decentralizedVoting.proposals(1);

      // Both voter1 and voter2's votes should count
      expect(proposal.forVotes).to.equal(2);
    });

    it("Should not allow self-delegation", async function () {
      await expect(decentralizedVoting.delegate(voter1.address)).to.be.reverted;
    });
  });
});
