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

  describe("Create a proposal", function () {
    it("Should create a new proposal (+ 12 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds
      const proposal = await decentralizedVoting.proposals(1);

      expect(proposal.description).to.equal("Test Proposal");
      expect(proposal.exists).to.equal(true);

      points += 12;
    });

    it("Should not create a proposal if it already exists (+ 8.5 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds

      await expect(decentralizedVoting.connect(addr2).createProposal(1, "Test Proposal", 1000)).to.be.reverted;

      points += 8.5;
    });
  });

  describe("Vote on a proposal", function () {
    it("Should allow voting on a proposal (+ 12 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds
      await decentralizedVoting.connect(addr2).vote(1, true);

      const proposal = await decentralizedVoting.proposals(1);

      expect(proposal.forVotes).to.equal(100); // Account `addr2` has a voting weight of 100

      points += 12;
    });

    it("Should not allow voting after proposal expiry (+ 8.5 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 2); // Proposal duration set to 2 seconds
      await ethers.provider.send("evm_increaseTime", [3]); // Fast forward time by 3 seconds
      await ethers.provider.send("evm_mine");

      await expect(decentralizedVoting.connect(addr2).vote(1, true)).to.be.revertedWith("Voting period has ended");

      points += 8.5;
    });
  });

  describe("Count votes for a proposal", function () {
    it("Should count the votes for a proposal (+ 10 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds
      await decentralizedVoting.connect(addr2).vote(1, true);
      await decentralizedVoting.connect(addr3).vote(1, true);
      await decentralizedVoting.countVotes(1);

      const proposal = await decentralizedVoting.proposals(1);

      expect(proposal.forVotes).to.equal(200); // Account `addr2` has a voting weight of 100, account `addr3` has a voting weight of 100
      expect(proposal.againstVotes).to.equal(0);

      points += 10;
    });
  });

  describe("Delegated voting", function () {
    it("Should allow delegated voting (+ 8.5 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds
      await decentralizedVoting.connect(addr2).delegate(addr3.address);
      await decentralizedVoting.connect(addr3).vote(1, true);

      const proposal = await decentralizedVoting.proposals(1);

      expect(proposal.forVotes).to.equal(100); // Account `addr3` voted on behalf of `addr2`, which has a voting weight of 100

      points += 8.5;
    });
  });

  describe("Quorum requirement", function () {
    it("Should consider a proposal valid only if quorum is met (+ 10 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds
      await decentralizedVoting.connect(addr2).vote(1, true);
      await decentralizedVoting.countVotes(1);

      const proposal1 = await decentralizedVoting.proposals(1);
      expect(proposal1.passed).to.equal(false); // Quorum not met

      await decentralizedVoting.connect(addr3).vote(1, true);
      await decentralizedVoting.countVotes(1);

      const proposal2 = await decentralizedVoting.proposals(1);
      expect(proposal2.passed).to.equal(true); // Quorum met

      points += 10;
    });
  });

  describe("Proposal status", function () {
    it("Should track proposal status (+ 8.5 points)", async function () {
      await decentralizedVoting.connect(addr1).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds

      const proposal1 = await decentralizedVoting.proposals(1);
      expect(proposal1.passed).to.equal(false); // Proposal status is initially false

      await decentralizedVoting.connect(addr2).vote(1, true);
      await decentralizedVoting.countVotes(1);

      const proposal2 = await decentralizedVoting.proposals(1);
      expect(proposal2.passed).to.equal(true); // Proposal status is updated to true after counting votes

      points += 8.5;
    });
  });

  describe("Emergency stop", function () {
    it("Should allow contract owner to pause voting (+ 8.5 points)", async function () {
      await decentralizedVoting.connect(owner).createProposal(1, "Test Proposal", 1000); // Proposal duration set to 1000 seconds
      await decentralizedVoting.connect(owner).pause();

      await expect(decentralizedVoting.connect(addr1).vote(1, true)).to.be.revertedWith("Pausable: paused");

      points += 8.5;
    });
  });

  describe("Total points", function () {
    it("You should have 65/65 on this assignment.", async function () {
      expect(points).to.equal(65);
    });
  });
});
