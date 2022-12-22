import hardhat, { ethers } from "hardhat";

function ether(eth: string) {
    let weiAmount = ethers.utils.parseEther(eth)
    return weiAmount;
}

async function main() {

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy("ERC20", "ERC20");
  await token.deployed();

  console.log("Token deployed to:", token.address);

  console.log("Waiting for 5 confirmations")
  await token.deployTransaction.wait(5)
  console.log("Confirmed!")

  console.log("Verifying...")
  await hardhat.run("verify:verify", {
    address: token.address,
    constructorArguments: ["ERC20", "ERC20"],
  })
  console.log("VERIFICATION COMPLETE")

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy("nft", "LP", "https://nft.com/", token.address);
  await nft.deployed();

  console.log("NFT deployed to:", nft.address);

  console.log("Waiting for 5 confirmations")
  await nft.deployTransaction.wait(5)
  console.log("Confirmed!")

  console.log("Verifying...")
  await hardhat.run("verify:verify", {
    address: nft.address,
    constructorArguments: ["nft", "LP", "https://nft.com/", token.address],
  })
  console.log("VERIFICATION COMPLETE")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});