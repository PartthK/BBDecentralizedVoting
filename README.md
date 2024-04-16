# Boiler Blockchain Group Project -- Decentralized Voting

## Description

This Solidity smart contract is related to the concept of Decentralized Voting and involves voting for or against proposals.

Functionality:
1. Creation of Proposals, where each proposal has a description attached. This is done so through the createProposal function, which checks if a proposal with the given ID already exists. If not, a new Proposal struct is created with the provided description and vote counts of zero.

2. Voting, where each voter can vote for or against a proposal. The vote function created in the smart contract is primarily responsible for this functionality. It first checks if the proposal exists and if the voter is authorized to vote. If both are true, it increments the appropriate vote counter variable based on the voter's choice.

3. Counting of Votes in favor of the proposal or against the said proposal is also executed in this contract through the countVotes function.

4. Assigning voting weights to voters. This is executed through the assignVotingWeight function, which helps to accurately model real-world scenarios where some people have more influential votes than others in certain situations.


## Primary Embedded Functions

- createProposal
- vote
- countVotes
- assignVotingWeights


## Setup

1. Download NodeJS if you don’t already have it: https://nodejs.org/en/download/ 
2. Clone the github repository: 
```
git clone https://github.com/PartthK/BBDecentralizedVoting.git
```
3. Open a terminal in the folder that was cloned
4. Type ```npm install``` (this should download all necessary packages)

You can now place your smart contract inside the contracts folder, and run ```npx hardhat test``` in the terminal to test the smart contract.

