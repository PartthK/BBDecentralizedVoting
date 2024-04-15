const { ethers } = require("hardhat");

async function main() {
  // Get the current timestamp in seconds
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  
  // Set the unlock time to 60 seconds from the current time
  const unlockTime = currentTimestampInSeconds + 60;

  // Define the amount to be locked
  const lockedAmount = ethers.utils.parseEther("0.001");

  // Deploy the Lock contract with unlock time and locked amount
  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  // Wait for the deployment transaction to be mined
  await lock.deployed();

  // Log Lock deployment details
  console.log(
    `Lock with ${ethers.utils.formatEther(lockedAmount)} ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  );

  // Deploy the DecentralizedVoting contract
  const DecentralizedVoting = await ethers.getContractFactory("DecentralizedVoting");
  const decentralizedVoting = await DecentralizedVoting.deploy();
  await decentralizedVoting.deployed();

  // Log DecentralizedVoting deployment details
  console.log("DecentralizedVoting contract deployed to:", decentralizedVoting.address);
}

// Run the main function and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
