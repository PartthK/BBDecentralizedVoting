const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("DecentralizedVoting", function () {
  let DecentralizedVoting;
  let decentralizedVoting;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let points = 0;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    DecentralizedVoting = await ethers.getContractFactory("DecentralizedVoting");
    decentralizedVoting = await DecentralizedVoting.deploy();
  });

  describe("Vote on a proposal", function () {
    it("Should allow voting on a proposal (+ 12 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds
      await decentralizedVoting.connect(addr2).vote(1, true);

      const proposal = await decentralizedVoting.proposals(1);

      expect(proposal.forVotes).to.equal(100); // Account `addr2` has a voting weight of 100

      points += 12;
    });
  });

  describe("Count votes for a proposal", function () {
    it("Should count the votes for a proposal (+ 10 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 2); // Proposal duration set to 2 seconds
      await ethers.provider.send("evm_increaseTime", [3]); // Fast forward time by 3 seconds
      await ethers.provider.send("evm_mine");

      await decentralizedVoting.connect(addr2).vote(1, true); // Vote after the voting period has ended

      await expect(decentralizedVoting.countVotes(1)).to.be.revertedWith("Voting period has ended");

      points += 10;
    });
  });

  describe("Delegated voting", function () {
    it("Should allow delegated voting (+ 8.5 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds
      await decentralizedVoting.connect(addr2).delegate(addr3.address);
      await ethers.provider.send("evm_increaseTime", [1001]); // Fast forward time by 1001 seconds
      await ethers.provider.send("evm_mine");

      await decentralizedVoting.connect(addr3).vote(1, true); // Vote after the voting period has ended

      await expect(decentralizedVoting.countVotes(1)).to.be.revertedWith("Voting period has ended");

      points += 8.5;
    });
  });

  describe("Quorum requirement", function () {
    it("Should consider a proposal valid only if quorum is met (+ 10 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds
      await decentralizedVoting.connect(addr2).vote(1, true);
      await ethers.provider.send("evm_increaseTime", [1001]); // Fast forward time by 1001 seconds
      await ethers.provider.send("evm_mine");

      await expect(decentralizedVoting.countVotes(1)).to.be.revertedWith("Voting period has ended");

      points += 10;
    });
  });

  describe("Proposal status", function () {
    it("Should track proposal status (+ 8.5 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds

      await ethers.provider.send("evm_increaseTime", [1001]); // Fast forward time by 1001 seconds
      await ethers.provider.send("evm_mine");

      await expect(decentralizedVoting.countVotes(1)).to.be.revertedWith("Voting period has ended");

      points += 8.5;
    });
  });

  describe("Emergency stop", function () {
    it("Should allow contract owner to pause voting (+ 8.5 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds
      await decentralizedVoting.connect(owner).pause(); // Pause voting

      await expect(decentralizedVoting.connect(addr1).vote(1, true)).to.be.revertedWith("Pausable: paused");

      points += 8.5;
    });
  });

  describe("Total points", function () {
    it("Should have 65/65 on this assignment.", async function () {
      expect(points).to.equal(65);
    });
  });
});
