const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("DecentralizedVoting", function () {
  let DecentralizedVoting;
  let decentralizedVoting;
  let owner;
  let addr1;
  let addr2;
  let points = 0;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    DecentralizedVoting = await ethers.getContractFactory("DecentralizedVoting");
    decentralizedVoting = await DecentralizedVoting.deploy();
  });

  describe("Create a proposal", function () {
    it("Should create a new proposal (+ 12 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal");
      const proposal = await decentralizedVoting.proposals(1);

      expect(proposal.description).to.equal("Test Proposal");
      expect(proposal.exists).to.equal(true);

      points += 12;
    });

    it("Should not create a proposal if it already exists (+ 8.5 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal");

      await expect(decentralizedVoting.connect(addr2).createProposal(1, "Test Proposal")).to.be.reverted;

      points += 8.5;
    });
  });

  describe("Vote on a proposal", function () {
    it("Should allow voting on a proposal (+ 12 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal");
      await decentralizedVoting.connect(addr2).vote(1, true);

      const proposal = await decentralizedVoting.proposals(1);

      expect(proposal.forVotes).to.equal(1);

      points += 12;
    });
  });

  describe("Count votes for a proposal", function () {
    it("Should count the votes for a proposal (+ 10 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal");
      await decentralizedVoting.connect(addr2).vote(1, true);
      await decentralizedVoting.countVotes(1);

      const proposal = await decentralizedVoting.proposals(1);

      expect(proposal.forVotes).to.equal(1);
      expect(proposal.againstVotes).to.equal(0);

      points += 10;
    });
  });

  describe("Assign voting weights", function () {
    it("Should assign voting weights to voters (+ 12 points)", async function () {
      await decentralizedVoting.assignVotingWeight([addr1.address, addr2.address], [100, 200]);

      const weight1 = await decentralizedVoting.voterWeights(addr1.address);
      const weight2 = await decentralizedVoting.voterWeights(addr2.address);

      expect(weight1).to.equal(100);
      expect(weight2).to.equal(200);

      points += 12;
    });
  });

  describe("Total points", function () {
    it("You should have 54.5/54.5 on this assignment.", async function () {
      expect(points).to.equal(54.5);
    });
  });
});
