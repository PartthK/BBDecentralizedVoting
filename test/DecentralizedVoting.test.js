const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("DecentralizedVoting", function () {
  let DecentralizedVoting;
  let decentralizedVoting;
  let owner;
  let addr1;
  let addr2;
  let points = 0;

  async function deployContract() {
    [owner, addr1, addr2] = await ethers.getSigners();
    DecentralizedVoting = await ethers.getContractFactory("DecentralizedVoting");
    decentralizedVoting = await DecentralizedVoting.deploy();
    await decentralizedVoting.deployed();
  }

  describe("Create a proposal", function () {
    it("Should create a new proposal (+ 12 points)", async function () {
      await deployContract();

      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal");
      const proposal = await decentralizedVoting.proposals(1);

      expect(proposal.description).to.equal("Test Proposal");
      expect(proposal.exists).to.equal(true);

      points += 12;
    });

    it("Should not create a proposal if it already exists (+ 8.5 points)", async function () {
      await deployContract();

      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal");

      await expect(decentralizedVoting.connect(addr2).createProposal(1, "Test Proposal")).to.be.reverted;

      points += 8.5;
    });
  });

  describe("Vote on a proposal", function () {
    it("Should allow voting on a proposal (+ 12 points)", async function () {
      await deployContract();

      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal");
      await decentralizedVoting.connect(addr2).vote(1, true);

      const proposal = await decentralizedVoting.proposals(1);

      expect(proposal.forVotes).to.equal(1);

      points += 12;
    });
  });

  describe("Count votes for a proposal", function () {
    it("Should count the votes for a proposal (+ 10 points)", async function () {
      await deployContract();

      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal");
      await decentralizedVoting.connect(addr2).vote(1, true);
      await decentralizedVoting.countVotes(1);

      const proposal = await decentralizedVoting.proposals(1);

      expect(proposal.forVotes).to.equal(1);
      expect(proposal.againstVotes).to.equal(0);

      points += 10;
    });
  });

  describe("Total points", function () {
    it("You should have 42.5/42.5 on this assignment.", async function () {
      expect(points).to.equal(42.5);
    });
  });
});
