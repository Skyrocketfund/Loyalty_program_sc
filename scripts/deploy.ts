import hardhat, { ethers } from "hardhat";

function ether(eth: string) {
    let weiAmount = ethers.utils.parseEther(eth)
    return weiAmount;
}

async function main() {

  // const Token = await ethers.getContractFactory("Token");
  // const token = await Token.deploy("ERC20", "ERC20");
  // await token.deployed();

  // console.log("Token deployed to:", token.address);

  // console.log("Waiting for 5 confirmations")
  // await token.deployTransaction.wait(5)
  // console.log("Confirmed!")

  // console.log("Verifying...")
  // await hardhat.run("verify:verify", {
  //   address: token.address,
  //   constructorArguments: ["ERC20", "ERC20"],
  // })
  // console.log("VERIFICATION COMPLETE")


  // const NFTPassID = await ethers.getContractFactory("NFTPassID");
  // const nftPassID = await NFTPassID.deploy("nftPass", "NP", "https://nftPass.com/");
  // await nftPassID.deployed();

  // console.log("NFT deployed to:", nftPassID.address);

  // console.log("Waiting for 5 confirmations")
  // await nftPassID.deployTransaction.wait(5)
  // console.log("Confirmed!")

  // console.log("Verifying...")
  // await hardhat.run("verify:verify", {
  //   address: nftPassID.address,
  //   constructorArguments: ["nftPass", "NP", "https://nftPass.com/"],
  // })
  // console.log("VERIFICATION COMPLETE")


  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy("nft", "LP", "https://nft.com/", "0x47962eadD72b930061ED4e9E1CA3a9039a1867DD", "0x46DE7be1692B810695E916138f52b594C75ED4C6");
  await nft.deployed();

  console.log("NFT deployed to:", nft.address);

  console.log("Waiting for 5 confirmations")
  await nft.deployTransaction.wait(5)
  console.log("Confirmed!")

  console.log("Verifying...")
  await hardhat.run("verify:verify", {
    address: nft.address,
    constructorArguments: ["nft", "LP", "https://nft.com/", "0x47962eadD72b930061ED4e9E1CA3a9039a1867DD", "0x46DE7be1692B810695E916138f52b594C75ED4C6"],
  })
  console.log("VERIFICATION COMPLETE")
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});