const { ethers } = require("hardhat");

async function main() {
  const DecentralizedVoting = await ethers.getContractFactory("DecentralizedVoting");
  const decentralizedVoting = await DecentralizedVoting.deploy();
  
  console.log("DecentralizedVoting contract deployed to:", decentralizedVoting.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
