// import {ethers, network, waffle} from "hardhat"
// import {Signer, Contract, ContractFactory, BigNumber} from "ethers"
// import chai, { use } from "chai"
// import {solidity} from "ethereum-waffle"
// import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers"
// import {
//     NFT,
//     NFT__factory,
// } from "../typechain-types";
// import { exec } from "child_process"

// chai.use(solidity)
// const {expect} = chai

// function ether(eth: string) {
//     let weiAmount = ethers.utils.parseEther(eth)
//     return weiAmount;
// }

// describe("Withdrawable/StakeOwnerExtension", async function () {
//     let owner: SignerWithAddress;
//     let stakeOwner: SignerWithAddress;
//     let user1: SignerWithAddress;
//     let NFT: NFT__factory;
//     let nft: NFT;    

//     beforeEach("Deploy contract", async function () {
//         [owner, user1] = await ethers.getSigners();
//         NFT = new NFT__factory(owner);

//         nft = await NFT.deploy("nft", "LG", "https://nft.com/", ether("0.01"), ether("0.1"));
//         await nft.deployed();
//     });

//     describe("Testing of all contractual functions", async function () {
//         let _tokenId = 1;
//         it("Ok: pending withdrawal", async () => {
//             expect(await nft.connect(user1).pendingWithdrawal()).to.equal(0);
//         });

//         it("Revert: Not owner withdraws all", async () => {
//             await expect(nft.connect(user1).withdrawAll()).to.be.revertedWith("Ownable: caller is not the owner");
//         });

//         it("Ok: Owner withdraws all", async () => {
//             const provider = waffle.provider;
//             expect(await provider.getBalance(nft.address)).to.equal(ether("0"));

//             expect(await nft.buyTokens(user1.address, {value: ether("0.1")})).to.ok
//                 .to.emit(nft, 'Mint')
//                 .withArgs(user1.address, _tokenId);

//             expect(await nft.withdrawAll()).to.changeEtherBalances([nft, owner], [ether("0.095").mul(-1), ether("0.095")])
//         });

//         it("Withdrawable: Amount has to be greater than 0", async () => {
//             await expect(nft.withdraw(0)).to.be.revertedWith("Withdrawable: Amount has to be greater than 0");
//         });

//         it("Withdrawable: Not enough funds", async () => {
//             expect(await nft.buyTokens(user1.address, {value: ether("0.1")})).to.ok
//                 .to.emit(nft, 'Mint')
//                 .withArgs(user1.address, _tokenId);
//             await expect(nft.withdraw(ether("2"))).to.be.revertedWith("Withdrawable: Not enough funds");
//         });

//         it("Ok: Owner withdraws", async () => {
//             const provider = waffle.provider;
//             expect(await provider.getBalance(nft.address)).to.equal(ether("0"));
//             expect(await nft.buyTokens(user1.address, {value: ether("0.1")})).to.ok
//                 .to.emit(nft, 'Mint')
//                 .withArgs(user1.address, _tokenId);
//             expect(await provider.getBalance(nft.address)).to.equal(ether("0.095"));
//             expect(await nft.withdraw(ether("0.005"))).to.changeEtherBalances([nft, owner], [ether("0.005").mul(-1), ether("0.005")]);
//         });

//         it("changeStakeOwnerAddress", async function () {
//             await expect(nft.changeStakeOwnerAddress(owner.address)).to.be.revertedWith("Only stake owner can call this function.");
//             expect(await nft.stakeOwner()).to.equal(stakeOwner.address);
//             expect(await nft.connect(stakeOwner).changeStakeOwnerAddress(user1.address)).to.ok;
//             expect(await nft.stakeOwner()).to.equal(user1.address);
//         });
//     });
// });