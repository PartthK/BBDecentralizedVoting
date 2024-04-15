const { ethers } = require("hardhat");

async function main() {
  const DecentralizedVoting = await ethers.getContractFactory("DecentralizedVoting");
  const decentralizedVoting = await DecentralizedVoting.deploy();
  
  await decentralizedVoting.deployed();

  // Test the new functionality: assign voting weights
  const [owner, addr1, addr2] = await ethers.getSigners();
  await decentralizedVoting.assignVotingWeight([addr1.address, addr2.address], [100, 200]);
  const weight1 = await decentralizedVoting.voterWeights(addr1.address);
  const weight2 = await decentralizedVoting.voterWeights(addr2.address);
  console.log("Voting weight for address 1:", weight1.toString());
  console.log("Voting weight for address 2:", weight2.toString());

  console.log("DecentralizedVoting contract deployed to:", decentralizedVoting.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
