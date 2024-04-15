const { ethers } = require("hardhat");

async function main() {
  const DecentralizedVoting = await ethers.getContractFactory("DecentralizedVoting");
  const decentralizedVoting = await DecentralizedVoting.deploy();
  await decentralizedVoting.deployed();

  console.log("DecentralizedVoting contract deployed to:", decentralizedVoting.address);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
